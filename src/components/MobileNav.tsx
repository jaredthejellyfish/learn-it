import { SignInButton, SignedIn, SignedOut } from '@clerk/astro/react'
import { AnimatePresence, motion } from 'framer-motion'
import { Zap } from 'lucide-react'
import { useState } from 'react'

import { ModeToggle } from './ModeToggle'
import { Button } from './ui/button'

const menuVariants = {
  closed: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.2,
      ease: 'easeInOut',
    },
  },
  open: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: 'easeOut',
    },
  },
}

const linkVariants = {
  closed: { x: -20, opacity: 0 },
  open: (i: number) => ({
    x: 0,
    opacity: 1,
    transition: {
      delay: i * 0.1,
      duration: 0.3,
      ease: 'easeOut',
    },
  }),
}

const logoVariants = {
  initial: { scale: 0.8, opacity: 0 },
  animate: {
    scale: 1,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  },
}

export function MobileNav({ isAuthenticated }: { isAuthenticated: boolean }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const navLinks = [
    {
      href: isAuthenticated ? '/dashboard' : '/',
      text: isAuthenticated ? 'Dashboard' : 'Home',
    },
    { href: '/features', text: 'Features' },
    { href: '/how-it-works', text: 'How It Works' },
    { href: '/pricing', text: 'Pricing' },
  ]

  return (
    <>
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4 py-6 flex justify-between items-center"
      >
        <motion.div
          variants={logoVariants}
          initial="initial"
          animate="animate"
          className="flex items-center space-x-2"
        >
          <Zap className="w-8 h-8 text-purple-600" />
          <span className="text-2xl font-bold">LearnIt</span>
        </motion.div>

        <nav className="hidden md:flex space-x-6 font-bold">
          {navLinks.map((link, i) => (
            <motion.a
              key={link.href}
              href={link.href}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.3 }}
              className="hover:text-purple-600 transition-colors"
            >
              {link.text}
            </motion.a>
          ))}
        </nav>

        <div className="flex items-center space-x-3">
          <ModeToggle />
          <SignedOut>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Button className="hidden md:inline-flex">
                <SignInButton mode="redirect" />
              </Button>
            </motion.div>
          </SignedOut>
          <SignedIn>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Button className="hidden md:inline-flex">Get Started</Button>
            </motion.div>
          </SignedIn>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden flex flex-col justify-center items-center h-10 w-10 gap-y-1"
          >
            <motion.span
              animate={{
                rotate: isMenuOpen ? 45 : 0,
                translateY: isMenuOpen ? 8 : -2,
              }}
              className="bg-black dark:bg-white block h-0.5 w-8 rounded-sm"
              transition={{ duration: 0.3 }}
            />
            <motion.span
              animate={{
                opacity: isMenuOpen ? 0 : 1,
              }}
              className="bg-black dark:bg-white block h-0.5 w-8 rounded-sm my-0.5"
              transition={{ duration: 0.3 }}
            />
            <motion.span
              animate={{
                rotate: isMenuOpen ? -45 : 0,
                translateY: isMenuOpen ? -8 : 2,
              }}
              className="bg-black dark:bg-white block h-0.5 w-8 rounded-sm"
              transition={{ duration: 0.3 }}
            />
          </button>
        </div>
      </motion.header>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            variants={menuVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="md:hidden bg-white dark:bg-gray-800 shadow-lg rounded-lg m-4 p-4"
          >
            <nav className="flex flex-col space-y-4 font-bold">
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  variants={linkVariants}
                  custom={i}
                  className="hover:text-purple-600 transition-colors"
                >
                  {link.text}
                </motion.a>
              ))}
              <motion.div variants={linkVariants} custom={navLinks.length}>
                <Button className="w-full">Get Started</Button>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
