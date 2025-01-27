'use client'

import { usePathname } from 'next/navigation'

const useGetPageNameClientSide = () => {
  const pathname = usePathname()
  if (pathname) return pathname.replace(/\//g, '').trim()
  return null
}

export { useGetPageNameClientSide }
