'use client'

import { usePathname } from 'next/navigation'

const getPageNameClientSide = () => {
  const pathname = usePathname()
  if (pathname) return pathname.replace(/\//g, '').trim()
  return null
}

export { getPageNameClientSide }
