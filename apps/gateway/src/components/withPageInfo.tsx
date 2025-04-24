import React from 'react'
import { headers } from 'next/headers'
import { isMobile } from '@src/utils'
import type { NextPage } from 'next'
import { PageAppProps, ServerPageInfo } from '@root/types/additional'

export default async function withPageInfo(Component: NextPage<PageAppProps, ServerPageInfo>) {
  return async function WithPageInfo(props: any) {
    'use server'

    const userAgent = (await headers()).get('user-agent') || ''
    const mobileCheck = isMobile(userAgent)
    // const session = await getSession(); // Fetch session data

    return <Component {...props} mobileCheck={mobileCheck} />;
  };
}
