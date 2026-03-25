#!/usr/bin/env python3
"""
Scrape product data from https://5sfashion.vn and generate MySQL seed SQL.

Target tables (matching backend entities):
- categories
- products
- product_images
- product_variants

Usage:
    python scripts/scrape_5sfashion_to_sql.py --output scripts/seed_5sfashion.sql --limit-products 200
"""

from __future__ import annotations

import argparse
import json
import re
import time
from collections import OrderedDict
from dataclasses import dataclass, field
from datetime import datetime, timezone
from decimal import Decimal
from typing import Dict, Iterable, List, Optional, Sequence, Set, Tuple
from urllib.parse import parse_qs, urlencode, urlparse, urlunparse

import requests
from bs4 import BeautifulSoup
from bs4 import FeatureNotFound
from requests import RequestException

BASE_URL = "https://5sfashion.vn"
HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/123.0.0.0 Safari/537.36"
    )
}


@dataclass
class CategoryData:
    id: int
    name: str
    slug: str


@dataclass
class VariantData:
    id: int
    product_id: int
    sku: str
    color: Optional[str]
    size: Optional[str]
    stock: int = 0
    price_override: Optional[Decimal] = None


@dataclass
class ImageData:
    id: int
    product_id: int
    image_url: str
    display_order: int


@dataclass
class ProductData:
    id: int
    category_id: int
    name: str
    slug: str
    sku_root: Optional[str]
    brand: str
    base_price: Optional[Decimal]
    original_price: Optional[Decimal]
    primary_image: Optional[str]
    description_highlights: Optional[str]
    description_material: Optional[str]
    description_fit: Optional[str]
    description_care: Optional[str]
    is_active: bool = True
    created_at: datetime = field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = field(default_factory=lambda: datetime.now(timezone.utc))


def slug_from_url(url: str) -> str:
    path = urlparse(url).path.strip("/")
    return path.split("/")[-1] if path else ""


def to_absolute(url: str) -> str:
    if not url:
        return url
    if url.startswith("http://") or url.startswith("https://"):
        return url
    if url.startswith("//"):
        return f"https:{url}"
    if url.startswith("/"):
        return f"{BASE_URL}{url}"
    return f"{BASE_URL}/{url.lstrip('/')}"


def set_page_query(url: str, page: int) -> str:
    parsed = urlparse(url)
    q = parse_qs(parsed.query)
    q["page"] = [str(page)]
    new_query = urlencode(q, doseq=True)
    return urlunparse(parsed._replace(query=new_query))


def parse_price_vnd(text: Optional[str]) -> Optional[Decimal]:
    if not text:
        return None
    digits = re.sub(r"[^0-9]", "", text)
    if not digits:
        return None
    return Decimal(digits)


def normalize_space(text: Optional[str]) -> Optional[str]:
    if text is None:
        return None
    cleaned = re.sub(r"\s+", " ", text).strip()
    return cleaned or None


def sql_escape(value: str) -> str:
    return (
        value.replace("\\", "\\\\")
        .replace("'", "''")
        .replace("\n", "\\n")
        .replace("\r", "")
    )


def sql_literal(value):
    if value is None:
        return "NULL"
    if isinstance(value, bool):
        return "1" if value else "0"
    if isinstance(value, Decimal):
        return format(value, "f")
    if isinstance(value, datetime):
        return f"'{value.strftime('%Y-%m-%d %H:%M:%S')}'"
    if isinstance(value, (int, float)):
        return str(value)
    return f"'{sql_escape(str(value))}'"


def common_prefix(values: Sequence[str]) -> Optional[str]:
    items = [v for v in values if v]
    if not items:
        return None
    prefix = items[0]
    for item in items[1:]:
        while not item.startswith(prefix) and prefix:
            prefix = prefix[:-1]
    prefix = prefix.rstrip("-_ ")
    return prefix if len(prefix) >= 4 else None


def fetch(
    session: requests.Session,
    url: str,
    timeout: int = 30,
    retries: int = 3,
    backoff_seconds: float = 1.2,
) -> str:
    last_exc: Optional[Exception] = None
    for attempt in range(1, retries + 1):
        try:
            resp = session.get(url, timeout=timeout, headers=HEADERS)
            resp.raise_for_status()
            return resp.text
        except RequestException as exc:
            last_exc = exc
            if attempt == retries:
                break
            time.sleep(backoff_seconds * attempt)

    assert last_exc is not None
    raise last_exc


def make_soup(html: str) -> BeautifulSoup:
    try:
        return BeautifulSoup(html, "lxml")
    except FeatureNotFound:
        return BeautifulSoup(html, "html.parser")


def discover_categories(session: requests.Session) -> OrderedDict[str, str]:
    html = fetch(session, BASE_URL)
    soup = make_soup(html)

    categories: OrderedDict[str, str] = OrderedDict()
    for a in soup.select('a[href*="/danh-muc/"]'):
        href = (a.get("href") or "").strip()
        if not href:
            continue
        href = to_absolute(href)
        if "/danh-muc/" not in href:
            continue
        slug = slug_from_url(href)
        if not slug:
            continue
        name = normalize_space(a.get_text(" ")) or slug.replace("-", " ").title()
        if slug not in categories:
            categories[slug] = name
    return categories


def discover_product_links_in_category(
    session: requests.Session,
    category_slug: str,
    max_pages: int,
    sleep_seconds: float,
) -> Set[str]:
    base_category_url = f"{BASE_URL}/danh-muc/{category_slug}"
    links: Set[str] = set()
    empty_or_repeat_pages = 0

    for page in range(1, max_pages + 1):
        url = set_page_query(base_category_url, page)
        try:
            html = fetch(session, url)
        except RequestException as exc:
            print(f"[WARN] Skip category page {url}: {exc}")
            empty_or_repeat_pages += 1
            if empty_or_repeat_pages >= 3:
                break
            continue

        page_links = set(
            re.findall(r"https://5sfashion\.vn/san-pham/[a-zA-Z0-9\-]+", html)
        )

        new_count = len(page_links - links)
        links.update(page_links)

        if not page_links or new_count == 0:
            empty_or_repeat_pages += 1
        else:
            empty_or_repeat_pages = 0

        if empty_or_repeat_pages >= 2:
            break

        if sleep_seconds > 0:
            time.sleep(sleep_seconds)

    return links


def parse_json_ld_product(soup: BeautifulSoup) -> Dict[str, Optional[str]]:
    result: Dict[str, Optional[str]] = {
        "name": None,
        "description": None,
        "brand": None,
        "price": None,
        "sku": None,
    }

    scripts = soup.find_all("script", attrs={"type": "application/ld+json"})
    for script in scripts:
        raw = script.string or script.get_text("", strip=False)
        if not raw:
            continue

        try:
            obj = json.loads(raw)
        except json.JSONDecodeError:
            continue

        candidates = obj if isinstance(obj, list) else [obj]
        for item in candidates:
            if not isinstance(item, dict):
                continue
            if item.get("@type") != "Product":
                continue

            result["name"] = normalize_space(item.get("name"))
            result["description"] = normalize_space(item.get("description"))
            result["sku"] = normalize_space(item.get("sku"))

            brand = item.get("brand")
            if isinstance(brand, dict):
                result["brand"] = normalize_space(brand.get("name"))
            elif isinstance(brand, str):
                result["brand"] = normalize_space(brand)

            offers = item.get("offers")
            if isinstance(offers, dict):
                result["price"] = str(offers.get("price")) if offers.get("price") else None
            elif isinstance(offers, list) and offers:
                first_offer = offers[0]
                if isinstance(first_offer, dict) and first_offer.get("price"):
                    result["price"] = str(first_offer.get("price"))

            return result

    return result


def parse_product_page(
    session: requests.Session,
    product_url: str,
    category_id: int,
    product_id: int,
    image_id_start: int,
    variant_id_start: int,
) -> Tuple[ProductData, List[ImageData], List[VariantData], int, int]:
    html = fetch(session, product_url)
    soup = make_soup(html)
    json_ld = parse_json_ld_product(soup)

    slug = slug_from_url(product_url)

    h1 = soup.find("h1")
    name = normalize_space(h1.get_text(" ")) if h1 else None
    name = name or json_ld.get("name") or slug.replace("-", " ").title()

    description = json_ld.get("description")
    if not description:
        meta_desc = soup.find("meta", attrs={"name": "description"})
        description = normalize_space(meta_desc.get("content")) if meta_desc else None

    brand = json_ld.get("brand") or "5S Fashion"

    image_urls: List[str] = []
    for img in soup.select(".product-detail-body .image img"):
        src = img.get("data-src") or img.get("src")
        src = to_absolute(src.strip()) if src else None
        if src and src not in image_urls:
            image_urls.append(src)

    if not image_urls:
        og_image = soup.find("meta", attrs={"property": "og:image"})
        if og_image and og_image.get("content"):
            image_urls.append(to_absolute(og_image["content"]))

    color_items = soup.select(
        ".product-color-size-variant .variant-color .variant-list li[data-product-color-id]"
    )
    size_items = soup.select(
        ".product-color-size-variant .variant-size .variant-list li[data-size-id]"
    )

    colors_by_second_id: Dict[str, str] = {}
    product_prefix: Optional[str] = None

    for li in color_items:
        color_name = normalize_space(li.get("data-color") or li.get_text(" "))
        color_key = li.get("data-product-color-id")
        if not color_key or "-" not in color_key:
            continue
        prefix, second = color_key.split("-", 1)
        if product_prefix is None:
            product_prefix = prefix
        if product_prefix == prefix and second and color_name:
            colors_by_second_id[second] = color_name

    sizes_by_id: Dict[str, str] = {}
    for li in size_items:
        size_id = (li.get("data-size-id") or "").strip()
        size_name = normalize_space(li.get("data-size") or li.get_text(" "))
        if size_id and size_name:
            sizes_by_id[size_id] = size_name

    variants: List[VariantData] = []
    seen_sku: Set[str] = set()
    sku_for_root: List[str] = []

    for inp in soup.select('input[type="hidden"][data-sku]'):
        sku = normalize_space(inp.get("data-sku"))
        if not sku or sku in seen_sku:
            continue

        class_tokens = inp.get("class", [])
        key_token = None
        for token in class_tokens:
            if re.match(r"^\d+-\d+-\d+$", token):
                key_token = token
                break
        if not key_token:
            continue

        prefix, color_id, size_id = key_token.split("-", 2)
        if product_prefix and prefix != product_prefix:
            continue

        color = colors_by_second_id.get(color_id)
        size = sizes_by_id.get(size_id)

        raw_original = inp.get("data-price")
        raw_promo = inp.get("data-price-promotion")

        original_price = parse_price_vnd(raw_original)
        promo_price = parse_price_vnd(raw_promo)
        chosen_price = promo_price if promo_price and promo_price > 0 else original_price

        variants.append(
            VariantData(
                id=variant_id_start,
                product_id=product_id,
                sku=sku,
                color=color,
                size=size,
                stock=0,
                price_override=chosen_price,
            )
        )
        variant_id_start += 1
        seen_sku.add(sku)
        sku_for_root.append(sku)

    base_price = variants[0].price_override if variants else None
    original_price = None
    if variants:
        all_prices = [v.price_override for v in variants if v.price_override is not None]
        if all_prices:
            base_price = min(all_prices)
            original_price = max(all_prices)

    if not base_price and json_ld.get("price"):
        try:
            base_price = Decimal(str(json_ld["price"]).replace(",", "").strip())
        except Exception:
            base_price = None

    if original_price is None:
        original_price = base_price

    if not variants:
        fallback_sku = (
            normalize_space(json_ld.get("sku"))
            or f"{slug.upper().replace('-', '_')}_DEFAULT"
        )
        variants.append(
            VariantData(
                id=variant_id_start,
                product_id=product_id,
                sku=fallback_sku,
                color=None,
                size=None,
                stock=0,
                price_override=base_price,
            )
        )
        variant_id_start += 1

    product = ProductData(
        id=product_id,
        category_id=category_id,
        name=name,
        slug=slug,
        sku_root=common_prefix(sku_for_root),
        brand=brand,
        base_price=base_price,
        original_price=original_price,
        primary_image=image_urls[0] if image_urls else None,
        description_highlights=description,
        description_material=None,
        description_fit=None,
        description_care=None,
        is_active=True,
    )

    images: List[ImageData] = []
    for idx, img_url in enumerate(image_urls, start=1):
        images.append(
            ImageData(
                id=image_id_start,
                product_id=product_id,
                image_url=img_url,
                display_order=idx,
            )
        )
        image_id_start += 1

    return product, images, variants, image_id_start, variant_id_start


def build_insert_statement(table: str, columns: Sequence[str], rows: Sequence[Sequence]) -> str:
    if not rows:
        return f"-- No rows for {table}"

    lines = []
    col_sql = ", ".join(columns)
    lines.append(f"INSERT INTO {table} ({col_sql}) VALUES")

    value_rows = []
    for row in rows:
        value_sql = ", ".join(sql_literal(v) for v in row)
        value_rows.append(f"  ({value_sql})")

    lines.append(",\n".join(value_rows))
    lines.append(";")
    return "\n".join(lines)


def generate_sql(
    categories: Sequence[CategoryData],
    products: Sequence[ProductData],
    images: Sequence[ImageData],
    variants: Sequence[VariantData],
) -> str:
    now_text = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S")

    category_rows = [
        [c.id, c.name, c.slug, None]
        for c in categories
    ]

    product_rows = [
        [
            p.id,
            p.category_id,
            p.name,
            p.slug,
            p.sku_root,
            p.brand,
            p.base_price,
            p.original_price,
            p.primary_image,
            p.description_highlights,
            p.description_material,
            p.description_fit,
            p.description_care,
            p.is_active,
            p.created_at or now_text,
            p.updated_at or now_text,
        ]
        for p in products
    ]

    image_rows = [
        [img.id, img.product_id, img.image_url, img.display_order]
        for img in images
    ]

    variant_rows = [
        [
            v.id,
            v.product_id,
            v.sku,
            v.color,
            v.size,
            v.stock,
            v.price_override,
        ]
        for v in variants
    ]

    parts = [
        "-- Generated by scrape_5sfashion_to_sql.py",
        "SET NAMES utf8mb4;",
        "SET FOREIGN_KEY_CHECKS = 0;",
        "",
        build_insert_statement(
            "categories",
            ["id", "name", "slug", "description"],
            category_rows,
        ),
        "",
        build_insert_statement(
            "products",
            [
                "id",
                "category_id",
                "name",
                "slug",
                "sku_root",
                "brand",
                "base_price",
                "original_price",
                "primary_image",
                "description_highlights",
                "description_material",
                "description_fit",
                "description_care",
                "is_active",
                "created_at",
                "updated_at",
            ],
            product_rows,
        ),
        "",
        build_insert_statement(
            "product_images",
            ["id", "product_id", "image_url", "display_order"],
            image_rows,
        ),
        "",
        build_insert_statement(
            "product_variants",
            ["id", "product_id", "sku", "color", "size", "stock", "price_override"],
            variant_rows,
        ),
        "",
        "SET FOREIGN_KEY_CHECKS = 1;",
        "",
    ]

    return "\n".join(parts)


def run(args: argparse.Namespace) -> None:
    session = requests.Session()

    categories_map = discover_categories(session)
    if not categories_map:
        raise RuntimeError("Could not discover categories from homepage.")

    categories: List[CategoryData] = []
    for idx, (slug, name) in enumerate(categories_map.items(), start=1):
        categories.append(CategoryData(id=idx, name=name, slug=slug))

    category_id_by_slug = {c.slug: c.id for c in categories}

    product_links_ordered: OrderedDict[str, int] = OrderedDict()
    for slug in categories_map.keys():
        category_id = category_id_by_slug[slug]
        try:
            links = discover_product_links_in_category(
                session,
                category_slug=slug,
                max_pages=args.max_category_pages,
                sleep_seconds=args.sleep,
            )
        except Exception as exc:
            print(f"[WARN] Skip category {slug}: {exc}")
            continue
        for link in sorted(links):
            if link not in product_links_ordered:
                product_links_ordered[link] = category_id

    all_product_links = list(product_links_ordered.items())
    if args.limit_products > 0:
        all_product_links = all_product_links[: args.limit_products]

    products: List[ProductData] = []
    images: List[ImageData] = []
    variants: List[VariantData] = []

    image_id = 1
    variant_id = 1

    for idx, (product_url, category_id) in enumerate(all_product_links, start=1):
        try:
            product, product_images, product_variants, image_id, variant_id = parse_product_page(
                session=session,
                product_url=product_url,
                category_id=category_id,
                product_id=idx,
                image_id_start=image_id,
                variant_id_start=variant_id,
            )
            products.append(product)
            images.extend(product_images)
            variants.extend(product_variants)
        except Exception as exc:
            print(f"[WARN] Skip {product_url}: {exc}")

        if args.sleep > 0:
            time.sleep(args.sleep)

    sql_text = generate_sql(categories, products, images, variants)
    with open(args.output, "w", encoding="utf-8") as f:
        f.write(sql_text)

    print(f"[DONE] Categories: {len(categories)}")
    print(f"[DONE] Products: {len(products)}")
    print(f"[DONE] Images: {len(images)}")
    print(f"[DONE] Variants: {len(variants)}")
    print(f"[DONE] SQL file: {args.output}")


def build_arg_parser() -> argparse.ArgumentParser:
    p = argparse.ArgumentParser(description="Scrape 5sfashion.vn and build MySQL seed SQL file.")
    p.add_argument(
        "--output",
        default="scripts/seed_5sfashion.sql",
        help="Output SQL file path (default: scripts/seed_5sfashion.sql)",
    )
    p.add_argument(
        "--limit-products",
        type=int,
        default=200,
        help="Max number of products to scrape (0 = no limit, default: 200)",
    )
    p.add_argument(
        "--max-category-pages",
        type=int,
        default=20,
        help="Max pages to scan per category (default: 20)",
    )
    p.add_argument(
        "--sleep",
        type=float,
        default=0.15,
        help="Delay between HTTP requests in seconds (default: 0.15)",
    )
    return p


if __name__ == "__main__":
    parser = build_arg_parser()
    run(parser.parse_args())
