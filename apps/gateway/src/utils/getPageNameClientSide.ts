'use client'

import { usePathname } from 'next/navigation'

const useGetPageNameClientSide = () => {
  const pathname = usePathname()
  if (!pathname) return null

  // Ensure consistent trailing slash format
  const normalized = pathname.endsWith('/') ? pathname : `${pathname  }/`
  return normalized
}

export { useGetPageNameClientSide }
