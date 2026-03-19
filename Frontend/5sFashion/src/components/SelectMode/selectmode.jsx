import { useEffect } from 'react'
import { Box, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material'
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined'
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined'
import SettingsBrightnessOutlinedIcon from '@mui/icons-material/SettingsBrightnessOutlined'
import { applyThemeMode, THEME_MODE_KEY } from '../../theme'

const SelectMode = ({ value, onChange }) => {
  useEffect(() => {
    applyThemeMode(value)

    if (value !== 'system' || typeof window === 'undefined') {
      return undefined
    }

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const listener = () => applyThemeMode('system')

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', listener)
      return () => mediaQuery.removeEventListener('change', listener)
    }

    mediaQuery.addListener(listener)
    return () => mediaQuery.removeListener(listener)
  }, [value])

  const handleModeChange = (_, nextValue) => {
    if (!nextValue) {
      return
    }
    localStorage.setItem(THEME_MODE_KEY, nextValue)
    onChange(nextValue)
  }

  return (
    <Box>
      <Typography sx={{ fontSize: '13px', mb: '6px', color: 'var(--text-light)' }}>Chế độ hiển thị</Typography>
      <ToggleButtonGroup
        value={value}
        exclusive
        onChange={handleModeChange}
        sx={{
          '& .MuiToggleButton-root': {
            textTransform: 'none',
            px: '12px',
            py: '6px',
            borderColor: 'var(--border-color)',
            color: 'var(--text-light)',
            backgroundColor: 'var(--bg-surface)',
            fontWeight: 600,
            transition: 'all 0.2s ease'
          },
          '& .MuiToggleButton-root:hover': {
            backgroundColor: 'var(--bg-muted)',
            color: 'var(--text-main)'
          },
          '& .Mui-selected': {
            backgroundColor: 'rgba(218, 37, 29, 0.12) !important',
            color: 'var(--primary-color) !important',
            borderColor: 'var(--primary-color) !important'
          }
        }}
      >
        <ToggleButton value="light">
          <LightModeOutlinedIcon sx={{ fontSize: 16, mr: '6px' }} />
          Light
        </ToggleButton>
        <ToggleButton value="dark">
          <DarkModeOutlinedIcon sx={{ fontSize: 16, mr: '6px' }} />
          Dark
        </ToggleButton>
        <ToggleButton value="system">
          <SettingsBrightnessOutlinedIcon sx={{ fontSize: 16, mr: '6px' }} />
          System
        </ToggleButton>
      </ToggleButtonGroup>
    </Box>
  )
}

export default SelectMode
