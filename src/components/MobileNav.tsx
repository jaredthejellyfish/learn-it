// components/MobileNav.jsx
import { SignInButton, SignedIn, SignedOut } from '@clerk/astro/react'
import { motion } from 'framer-motion'
import { Zap } from 'lucide-react'
import { useState } from 'react'


import { ModeToggle } from './ModeToggle'
import { Button } from './ui/button'

export function MobileNav({ isAuthenticated }: { isAuthenticated: boolean }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <>
      <header className="container mx-auto px-4 py-6 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Zap className="w-8 h-8 text-purple-600" />
          <span className="text-2xl font-bold">LearnIt</span>
        </div>
        <nav className="hidden md:flex space-x-6 font-bold">
          {isAuthenticated ? (
            <a
              href="/dashboard"
              className="hover:text-purple-600 transition-colors"
            >
              Dashboard
            </a>
          ) : (
            <a href="/" className="hover:text-purple-600 transition-colors">
              Home
            </a>
          )}
          <a
            href="/features"
            className="hover:text-purple-600 transition-colors"
          >
            Features
          </a>
          <a
            href="/how-it-works"
            className="hover:text-purple-600 transition-colors"
          >
            How It Works
          </a>
          <a
            href="/pricing"
            className="hover:text-purple-600 transition-colors"
          >
            Pricing
          </a>
        </nav>
        <div className="flex items-center space-x-3">
          <ModeToggle />
          <SignedOut>
            <Button className="hidden md:inline-flex">
              <SignInButton mode="redirect" />
            </Button>
          </SignedOut>
          <SignedIn>
            <Button className="hidden md:inline-flex">Get Started</Button>
          </SignedIn>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden flex flex-col justify-center items-center h-10 w-10 gap-y-1 t"
          >
            <span
              className={`bg-black dark:bg-white block transition-all duration-300 ease-out h-0.5 w-8 rounded-sm ${isMenuOpen ? 'rotate-45 translate-y-2' : '-translate-y-0.5'}`}
            ></span>
            <span
              className={`bg-black dark:bg-white block transition-all duration-300 ease-out h-0.5 w-8 rounded-sm my-0.5 ${isMenuOpen ? 'opacity-0' : 'opacity-100'}`}
            ></span>
            <span
              className={`bg-black dark:bg-white block transition-all duration-300 ease-out h-0.5 w-8 rounded-sm ${isMenuOpen ? '-rotate-45 -translate-y-2' : 'translate-y-0.5'}`}
            ></span>
          </button>
        </div>
      </header>

      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="md:hidden bg-white dark:bg-gray-800 shadow-lg rounded-lg m-4 p-4"
        >
          <nav className="flex flex-col space-y-4 font-bold">
            <a href="/" className="hover:text-purple-600 transition-colors">
              Home
            </a>
            <a
              href="/features"
              className="hover:text-purple-600 transition-colors"
            >
              Features
            </a>
            <a
              href="/how-it-works"
              className="hover:text-purple-600 transition-colors"
            >
              How It Works
            </a>
            <a
              href="/pricing"
              className="hover:text-purple-600 transition-colors"
            >
              Pricing
            </a>
            <Button className="w-full">Get Started</Button>
          </nav>
        </motion.div>
      )}
    </>
  )
}
