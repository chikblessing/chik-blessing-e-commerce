import React from 'react'
import type { Metadata } from 'next'
import { Providers } from '@/providers'
import { InitTheme } from '@/providers/Theme/InitTheme'
import { Bai_Jamjuree } from 'next/font/google'
import { getServerSideURL } from '@/utilities/getURL'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'

import '../(frontend)/globals.css'

const baiJamjuree = Bai_Jamjuree({
  subsets: ['latin'],
  weight: ['200', '300', '400', '500', '600', '700'],
})

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <html className={baiJamjuree.className} lang="en" suppressHydrationWarning>
      <head>
        <InitTheme />
        <link href="/favicon.ico" rel="icon" sizes="32x32" />
        <link href="/favicon.svg" rel="icon" type="image/svg+xml" />
      </head>
      <body>
        <Providers>
          {/* Auth pages - no header/footer */}
          {children}
        </Providers>
      </body>
    </html>
  )
}

export const metadata: Metadata = {
  title: 'Authentication - CBCS',
  description: 'Login or create an account to access your CBCS dashboard',
  metadataBase: new URL(getServerSideURL()),
  openGraph: mergeOpenGraph({
    title: 'Authentication - CBCS',
    description: 'Login or create an account to access your CBCS dashboard',
  }),
  twitter: {
    card: 'summary_large_image',
    creator: '@payloadcms',
  },
}
