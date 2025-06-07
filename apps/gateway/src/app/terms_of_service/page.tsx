'use client'

import React from 'react'
import dynamic from 'next/dynamic'
// import Link from 'next/link'
import type { NextPage } from 'next'
import { PageAppProps } from '@root/types/additional'

const PageContent = dynamic(() => import('@src/components/footer/terms_of_service'), { ssr: false })

const Page: NextPage<PageAppProps> = () => {
  return (
    <PageContent />
  )
}

export default Page
