import type React from "react"
import type { Metadata } from "next"
import { Analytics } from "@vercel/analytics/next"
import "@fontsource/inter/400.css"
import "@fontsource/inter/500.css"
import "@fontsource/inter/600.css"
import "@fontsource/inter/700.css"
import "./globals.css"
import AuthProvider from '@/components/providers/auth-provider'

export const metadata: Metadata = {
  title: "Ecossistema de Inovação do Maranhão",
  description:
    "Fomentando inovação nas empresas do Maranhão, incentivando startups e dando visibilidade a ideias inovadoras da comunidade local.",
  generator: "v0.app",
  keywords: [
    "inovação",
    "maranhão",
    "startups",
    "SEBRAE",
    "UEMASUL",
    "SENAI",
    "SENAC",
    "IFMA",
    "coworking",
    "incubadora",
  ],
  icons: {
    icon: [
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
      {
        url: "/ecossistema.png",
        sizes: "32x32",
        type: "image/png",
      },
    ],
    apple: "/ecossistema.png",
    shortcut: "/icon.svg",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <body
        className="antialiased"
        style={{ fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif' }}
        suppressHydrationWarning
      >
        <AuthProvider>
          {children}
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  )
}
