'use client';

import { useEffect, useState } from 'react';

export function useOrigin() {
  const [mounted, setMounted] = useState(false);
  const origin = typeof window !== 'undefined' && window.location.origin ? window.location.origin : '';

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- Required to prevent hydration mismatch
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return origin;
}
