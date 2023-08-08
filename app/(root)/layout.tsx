import Topbar from '@/components/shared/Topbar'
import '../globals.css'
import { Inter } from 'next/font/google'
import LeftSideBar from '@/components/shared/LeftSidebar'
import RightSideBar from '@/components/shared/RightSidebar'
import Bottombar from '@/components/shared/Bottombar'
import { ClerkProvider } from '@clerk/nextjs'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Twittwar',
  description: 'Twittwar  created with Nextjs13',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <Topbar />
          <main className='flex flex-row'>
            <LeftSideBar />
            <section className="main-container">
              <div className="w-full max-w-4xl">
                {children}
              </div>
            </section>
            <RightSideBar />
          </main>
          <Bottombar />
        </body>
      </html>
    </ClerkProvider>
  )
}
