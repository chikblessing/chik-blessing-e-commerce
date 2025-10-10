import Script from 'next/script'
import React from 'react'

import { defaultTheme, themeLocalStorageKey } from '../ThemeSelector/types'

export const InitTheme: React.FC = () => {
  return (
    // eslint-disable-next-line @next/next/no-before-interactive-script-outside-document
    <Script
      dangerouslySetInnerHTML={{
        __html: `
  (function () {
    // Force light mode - ignore system preferences and localStorage
    var themeToSet = 'light'
    
    // Set data-theme attribute
    document.documentElement.setAttribute('data-theme', themeToSet)
    
    // Also add light class to html element
    document.documentElement.classList.add('light')
    document.documentElement.classList.remove('dark')
    
    // Remove any dark mode preference from localStorage to prevent conflicts
    try {
      window.localStorage.removeItem('${themeLocalStorageKey}')
    } catch (e) {}
  })();
  `,
      }}
      id="theme-script"
      strategy="beforeInteractive"
    />
  )
}
