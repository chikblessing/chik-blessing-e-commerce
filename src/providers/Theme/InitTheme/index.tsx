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
    // Force light mode - ignore system preferences
    var themeToSet = 'light'
    
    // Optional: You can still allow users to manually switch if they have a preference saved
    // Uncomment the lines below if you want to respect manual user preference from localStorage
    // var preference = window.localStorage.getItem('${themeLocalStorageKey}')
    // if (preference === 'light' || preference === 'dark') {
    //   themeToSet = preference
    // }

    document.documentElement.setAttribute('data-theme', themeToSet)
  })();
  `,
      }}
      id="theme-script"
      strategy="beforeInteractive"
    />
  )
}
