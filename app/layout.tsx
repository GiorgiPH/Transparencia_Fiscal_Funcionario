import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { ThemeProvider } from '@/components/theme-provider'
import { NotificationsProvider } from '@/components/shared/NotificationsProvider'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Portal de Transparencia Fiscal - Operativo',
  description: 'Sistema de gestión de transparencia fiscal para administradores',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/transparencia-fiscal-operativo/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/transparencia-fiscal-operativo/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/transparencia-fiscal-operativo/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/transparencia-fiscal-operativo/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <NotificationsProvider>
            {children}
          </NotificationsProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}