import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Kevin Farokhrouz',
  description: `Good morning, and in case I don't see ya, good afternoon, good evening, and good night!`,
  keywords: ["Kevin", "Farokhrouz", "Kevin Farokhrouz", "Developer", "Full Stack", "Software", "Software Engineer"],
  authors: [{ name: "Kevin Farokhrouz" }],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white min-h-screen`}>
        {children}
      </body>
    </html>
  )
}

