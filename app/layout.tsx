import type { Metadata } from 'next'
import { Geist, Geist_Mono, Lora, Noto_Sans_Devanagari } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import Script from 'next/script'
import { ThemeProvider } from '@/components/theme-provider'
import './globals.css'

const _geist = Geist({ subsets: ["latin"], variable: '--font-sans' });
const _geistMono = Geist_Mono({ subsets: ["latin"], variable: '--font-mono' });
const _lora = Lora({ subsets: ["latin"], variable: '--font-serif' });
const _noto = Noto_Sans_Devanagari({ weight: ['400', '500', '600', '700'], subsets: ["devanagari"], variable: '--font-hindi' });

export const metadata: Metadata = {
  title: 'Drishyam News - Breaking News & Analysis',
  description: 'Latest news, breaking stories, and in-depth analysis from Drishyam News',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

import { LanguageProvider } from '@/components/providers/LanguageProvider'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${_lora.variable} ${_geist.variable} ${_geistMono.variable} ${_noto.variable}`} suppressHydrationWarning>
      <head>
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXX"
          strategy="afterInteractive"
          crossOrigin="anonymous"
        />
      </head>
      <body className="font-sans antialiased min-h-screen bg-background text-foreground tracking-tight" suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <LanguageProvider>
            {children}
          </LanguageProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
