import { FC } from 'react'
import Navbar from '@/components/Navbar'
import { Toaster } from '@/components/ui/Toast'
import { Inter } from 'next/font/google'
import Footer from './Footer'



interface LayoutProps {
  children: React.ReactNode
}

const Layout: FC<LayoutProps> = ({ children }) => {
  return (
      <div className="relative min-h-screen pb-20 text-slate-900 antialiased">
        <Toaster position="bottom-right" />
        <Navbar />
        {children}
        <Footer />
      </div>
  )
}

export default Layout
