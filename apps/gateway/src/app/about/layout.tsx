import React from 'react'
import dynamic from 'next/dynamic'

import classNames from 'classnames'
import {
  Title,
} from '@src/components/flex-server-components'
import {
  TitleLevel
 } from '@flex-design-system/react-ts/client-sync-styled-default'
import { default as flexStyles } from '@src/styles/scss/flex/all.module.scss'
import { default as stylesPage } from '@src/styles/scss/pages/todo.module.scss'

const LogoAPE = dynamic(() => import('@src/components/logo-ape'), { ssr: true })

// import chromium from '@sparticuz/chromium-min'
// const chromiumPath = await chromium.executablePath()
// console.log('chromium.executablePath', chromiumPath)
// import { marpCli, waitForObservation } from '@marp-team/marp-cli'

// let Slides: any = () => null

// const showMarpSlides = async () => {
//   // Store the original CHROME_PATH environment variable
//   const { CHROME_PATH } = process.env
//   try {

//     // Set the CHROME_PATH environment variable to the path of the Chromium binary
//     // @ts-expect-error
//     process.env.CHROME_PATH = await chromium.executablePath

//     Slides = () => {
//       marpCli(['--server', '../..slides/'])
//         .then((exitCode) => console.log(`Done with exit code ${exitCode}`))
//         .catch(console.error)

//       waitForObservation().then(({ stop }) => {
//         console.log('Observed')
//         // Stop observations to resolve marpCli()'s Promise
//         stop()
//       })
//     }

//   } finally {
//     // Restore the original CHROME_PATH environment variable
//     process.env.CHROME_PATH = CHROME_PATH
//   }
// }

// showMarpSlides()

// // Store the original CHROME_PATH environment variable
// const { CHROME_PATH } = process.env
// try {
//   // Set the CHROME_PATH environment variable to the path of the Chromium binary
//   // @ts-expect-error
//   process.env.CHROME_PATH = await chromium.executablePath

//   Slides = await marpCli(['--server', '../..slides/'])
//     .then((exitCode) => console.log(`Done with exit code ${exitCode}`))
//     .catch(console.error)

//   waitForObservation().then(({ stop }) => {
//     console.log('Observed')
//     // Stop observations to resolve marpCli()'s Promise
//     stop()
//   })

// } finally {
//   // Restore the original CHROME_PATH environment variable
//   process.env.CHROME_PATH = CHROME_PATH
// }

export default async function AboutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className={stylesPage.todoApp}>
      <div style={{
        height: 'auto',
        padding: '2rem 0',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <div style={{
          width: '100%',
        }}>
          <LogoAPE />
        </div>
      </div>
      <main>
        <Title level={TitleLevel.LEVEL1} className={classNames(flexStyles.isCentered)} style={{ marginTop: '-1rem' }}>
          {`À propos de ce site`}
        </Title>
        {/* <Slides/> */}
        <section>{children}</section>
      </main>
    </div>
  )
}
