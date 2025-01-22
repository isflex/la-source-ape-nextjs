'use server'

import { headers } from 'next/headers'

export async function getPathNameServerSide() {
  return (await headers()).get('next-url')
}
