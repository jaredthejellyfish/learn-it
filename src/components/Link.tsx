import React, { useCallback, useEffect, useState } from 'react'

interface LinkProps {
  href: string
  children: React.ReactNode
  className?: string
  prefetch?: boolean
}

interface ParsedContent {
  head: string
  body: string
}

export default function Link({
  href,
  children,
  className = '',
  prefetch = true,
}: LinkProps) {
  const [fetchedContent, setFetchedContent] = useState<ParsedContent | null>(
    null,
  )
  const [loading, setLoading] = useState(false)

  const parseHTML = (html: string): ParsedContent => {
    const parser = new DOMParser()
    const doc = parser.parseFromString(html, 'text/html')

    return {
      head: doc.head.innerHTML,
      body: doc.body.innerHTML,
    }
  }

  const fetchPage = useCallback(async () => {
    if (loading) return null

    setLoading(true)
    try {
      const response = await fetch(href)
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`)
      const html = await response.text()
      const parsedContent = parseHTML(html)
      setFetchedContent(parsedContent)
      return parsedContent
    } catch (error) {
      console.error('Error fetching page:', error)
      return null
    } finally {
      setLoading(false)
    }
  }, [href, loading])

  const prefetchPage = useCallback(() => {
    if (
      !prefetch ||
      fetchedContent ||
      loading ||
      window.location.pathname === href
    )
      return

    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(() => fetchPage(), { timeout: 2000 })
    } else {
      setTimeout(() => fetchPage(), 0)
    }
  }, [prefetch, fetchedContent, loading, fetchPage, href])

  const performNavigation = useCallback(
    (content: ParsedContent) => {
      try {
        document.head.innerHTML = content.head
        document.body.innerHTML = content.body
        window.history.pushState({}, '', href)
      } catch (err) {
        console.error('Error during navigation:', err)
        window.location.href = href
      }
    },
    [href],
  )

  const handleNavigation = async (e: React.MouseEvent) => {
    e.preventDefault()

    if (window.location.pathname === href) {
      return
    }

    const content = fetchedContent || (await fetchPage())
    if (content) {
      performNavigation(content)
    } else {
      window.location.href = href
    }
  }

  useEffect(() => {
    const buttonId = `link-${href.replace(/[^a-zA-Z0-9]/g, '-')}`
    const button = document.getElementById(buttonId)

    if (button) {
      button.addEventListener('mouseenter', prefetchPage)
      button.addEventListener('touchstart', prefetchPage, { passive: true })
    }

    return () => {
      if (button) {
        button.removeEventListener('mouseenter', prefetchPage)
        button.removeEventListener('touchstart', prefetchPage)
      }
    }
  }, [prefetchPage, href])

  const sanitizedHref = href.replace(/[^a-zA-Z0-9]/g, '-')
  const combinedClassName = `${className} cursor-pointer`.trim()

  return (
    <button
      id={`link-${sanitizedHref}`}
      onClick={handleNavigation}
      className={combinedClassName}
    >
      {children}
    </button>
  )
}
