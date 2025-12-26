import Script from 'next/script';
import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  metadataBase: new URL('https://kevinrouz.dev'),
  title: 'Kevin Farokhrouz',
  description: `Good morning, and in case I don't see ya, good afternoon, good evening, and good night!`,
  keywords: ["Kevin", "Farokhrouz", "Kevin Farokhrouz", "Developer", "Full Stack", "Software", "Software Engineer"],
  authors: [{ name: "Kevin Farokhrouz" }],
  openGraph: {
    title: 'Kevin Farokhrouz',
    description: `Good morning, and in case I don't see ya, good afternoon, good evening, and good night!`,
    url: 'https://www.kevinrouz.dev',
    type: 'website',
    images: [
      {
        url: '/kevinphoto1.jpg',
        width: 1200,
        height: 630,
        alt: 'Kevin Farokhrouz'
      }
    ]
  }
};


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <Script async src="https://www.googletagmanager.com/gtag/js?id=G-42BRBQ40LQ" />
        <Script  id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-42BRBQ40LQ');
            `}
        </Script>
      </head>
      <body className={`${inter.className} bg-black text-white min-h-screen`}>
        {children}
      </body>
    </html>
  )
}

