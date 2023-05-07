import { FC } from 'react'
import Navbar from '@/components/Navbar'
import { Toaster } from '@/components/ui/Toast'
import { cn } from '@/lib/utils'
import { Inter } from 'next/font/google'
import Footer from './Footer'

const inter = Inter({ subsets: ['latin'] })

interface LayoutProps {
  children: React.ReactNode
}

const Layout: FC<LayoutProps> = ({ children }) => {
  return (
    // <html
    //   lang="en"
    //   className={cn('bg-white text-slate-900 antialiased', inter.className)}
    // >
      <div className="relative min-h-screen text-slate-900 bg-slate-50 antialiased">
        <Toaster position="bottom-right" />
        <Navbar />
        {children}
        <Footer />
      </div>
    // </html>
  )
}

export default Layout
