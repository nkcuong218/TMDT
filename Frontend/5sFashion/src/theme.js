export const THEME_MODE_KEY = 'settings_theme_mode'

export const globalThemeStyles = `
:root {
  --primary-color: #DA251D;
  --primary-hover: #b71c1c;
  --secondary-color: #d32f2f;
  --accent-color: #FFA726;

  --text-main: #1f2937;
  --text-light: #6b7280;
  --text-muted: #94a3b8;

  --bg-body: #f4f6fa;
  --bg-light: #f8f9fa;
  --bg-surface: #ffffff;
  --bg-muted: #eef2f7;

  --white: #ffffff;
  --black: #000000;
  --border-color: #dbe1ea;

  --font-main: 'Outfit', sans-serif;
  --font-body: 'Roboto', sans-serif;

  --container-width: 1280px;
  --header-height: 80px;

  --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
  --shadow-hover: 0 10px 15px rgba(0, 0, 0, 0.1);

  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 16px;
  --radius-full: 9999px;

  --transition: all 0.3s ease;
}

:root[data-theme='dark'] {
  --primary-color: #e23a33;
  --primary-hover: #c92f29;
  --secondary-color: #f16a64;
  --accent-color: #f59e0b;

  --text-main: #f5f6f8;
  --text-light: #d6dae0;
  --text-muted: #a7afb9;

  --bg-body: #2f343b;
  --bg-light: #3a4048;
  --bg-surface: #434a54;
  --bg-muted: #565f6b;

  --white: #f8fafc;
  --black: #111827;
  --border-color: #6a7380;

  --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.22), 0 1px 2px rgba(0, 0, 0, 0.16);
  --shadow-md: 0 6px 14px rgba(0, 0, 0, 0.24);
  --shadow-hover: 0 14px 24px rgba(0, 0, 0, 0.26);
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: var(--font-body);
  color: var(--text-main);
  background-color: var(--bg-body);
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
  transition: background-color 0.25s ease, color 0.25s ease;
}

h1,
h2,
h3,
h4,
h5,
h6 {
  font-family: var(--font-main);
  font-weight: 700;
  line-height: 1.2;
}

a {
  text-decoration: none;
  color: inherit;
  transition: var(--transition);
}

ul {
  list-style: none;
}

img {
  max-width: 100%;
  display: block;
}

input,
textarea,
select {
  color: var(--text-main);
}

button {
  cursor: pointer;
  font-family: var(--font-main);
  border: none;
  outline: none;
  background: none;
}

.container {
  max-width: var(--container-width);
  margin: 0 auto;
  padding: 0 16px;
}

.flex {
  display: flex;
}

.flex-col {
  flex-direction: column;
}

.items-center {
  align-items: center;
}

.justify-between {
  justify-content: space-between;
}

.justify-center {
  justify-content: center;
}

.gap-2 {
  gap: 8px;
}

.gap-4 {
  gap: 16px;
}

.text-primary {
  color: var(--primary-color);
}

.text-secondary {
  color: var(--secondary-color);
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 10px 24px;
  border-radius: var(--radius-sm);
  font-weight: 600;
  font-size: 14px;
  transition: var(--transition);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.btn-primary {
  background-color: var(--primary-color);
  color: var(--white);
}

.btn-primary:hover {
  background-color: var(--primary-hover);
  transform: translateY(-1px);
}

.btn-outline {
  border: 1px solid var(--text-main);
  background-color: transparent;
  color: var(--text-main);
}

.btn-outline:hover {
  background-color: var(--text-main);
  color: var(--white);
}

.section-title {
  font-size: 28px;
  text-align: center;
  margin-bottom: 32px;
  text-transform: uppercase;
  position: relative;
  display: inline-block;
}

.section-title::after {
  content: '';
  display: block;
  width: 60px;
  height: 3px;
  background-color: var(--primary-color);
  margin: 8px auto 0;
}

.grid-products {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
}

@media (max-width: 1024px) {
  .grid-products {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 768px) {
  .grid-products {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }

  :root {
    --header-height: 60px;
  }
}

.MuiPaper-root {
  transition: background-color 0.25s ease, color 0.25s ease, border-color 0.25s ease;
}

[data-theme='dark'] .MuiPaper-root,
[data-theme='dark'] .MuiMenu-paper,
[data-theme='dark'] .MuiPopover-paper,
[data-theme='dark'] .MuiDialog-paper {
  background-color: var(--bg-surface);
  color: var(--text-main);
  border-color: var(--border-color);
}

[data-theme='dark'] .MuiOutlinedInput-root,
[data-theme='dark'] .MuiInputBase-root,
[data-theme='dark'] .MuiSelect-select {
  color: var(--text-main);
}

[data-theme='dark'] .MuiOutlinedInput-notchedOutline {
  border-color: var(--border-color);
}

[data-theme='dark'] .MuiTypography-root,
[data-theme='dark'] .MuiFormControlLabel-label,
[data-theme='dark'] .MuiButton-root {
  color: inherit;
}
`

export const getSystemMode = () => {
  if (typeof window === 'undefined') return 'light'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export const getResolvedTheme = (mode) => {
  if (mode === 'system') return getSystemMode()
  return mode === 'dark' ? 'dark' : 'light'
}

export const applyThemeMode = (mode) => {
  if (typeof document === 'undefined') return
  document.documentElement.setAttribute('data-theme', getResolvedTheme(mode))
}

export const applyThemeFromStorage = () => {
  if (typeof window === 'undefined') return
  const savedMode = localStorage.getItem(THEME_MODE_KEY) || 'system'
  applyThemeMode(savedMode)
}

export const injectGlobalThemeStyles = () => {
  if (typeof document === 'undefined') return
  if (document.getElementById('main-styles')) return
  const styleEl = document.createElement('style')
  styleEl.id = 'main-styles'
  styleEl.textContent = globalThemeStyles
  document.head.appendChild(styleEl)
}

export const initThemeSystemSync = () => {
  if (typeof window === 'undefined') return
  applyThemeFromStorage()

  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
  const handleSystemThemeChange = () => {
    if ((localStorage.getItem(THEME_MODE_KEY) || 'system') === 'system') {
      applyThemeFromStorage()
    }
  }

  if (mediaQuery.addEventListener) {
    mediaQuery.addEventListener('change', handleSystemThemeChange)
  } else {
    mediaQuery.addListener(handleSystemThemeChange)
  }
}