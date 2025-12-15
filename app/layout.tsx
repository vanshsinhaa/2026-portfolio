import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import localFont from "next/font/local"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { TimeThemeProvider } from "@/components/time-theme-provider"
import { CustomCursor } from "@/components/custom-cursor"
import { PageTransition } from "@/components/page-transition"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

// ABC Favorit font for hero
export const favorit = localFont({
  src: [
    {
      path: '../public/favorit-font-family-1765765530-0/ABCFavorit-Light-Trial.otf',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../public/favorit-font-family-1765765530-0/ABCFavorit-Regular-Trial.otf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../public/favorit-font-family-1765765530-0/ABCFavorit-Medium-Trial.otf',
      weight: '500',
      style: 'normal',
    },
  ],
  variable: '--font-favorit',
})

export const metadata: Metadata = {
  title: "Vansh Sinha — Data Engineer & Full-Stack Developer",
  description:
    "Portfolio of Vansh Sinha, specializing in data engineering, cloud infrastructure, and full-stack development.",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://cdn.jsdelivr.net" />
        <link rel="dns-prefetch" href="https://cdn.jsdelivr.net" />
      </head>
      <body className={`font-sans antialiased cursor-none ${favorit.variable}`}>
        <CustomCursor />
        <TimeThemeProvider>
          <SiteHeader />
          <main className="min-h-screen">
            <PageTransition>{children}</PageTransition>
          </main>
          <SiteFooter />
        </TimeThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
