import * as path from 'path'
// import os from 'node:os'
// import fs, { writeFileSync } from 'node:fs'
// import { v4 as uuidv4 } from 'uuid'

import { fileURLToPath } from 'url'
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// import detect from 'detect-port'
// import { isServer } from '@src/utils'

import { headers } from 'next/headers'
// import { isMobile } from 'react-device-detect'
import { isMobile } from '@src/utils'

import React from 'react'
import dynamic from 'next/dynamic'

import classNames from 'classnames'
import {
  Title,
  Text,
} from '@src/components/flex-server-components'
import {
  TitleLevel
 } from '@flex-design-system/react-ts/client-sync-styled-default'
import { default as flexStyles } from '@src/styles/scss/flex/all.module.scss'
import { default as stylesPage } from '@src/styles/scss/pages/about.module.scss'

const LogoAPE = dynamic(() => import('@src/components/logo-ape'), { ssr: true })

import SpaghettiHolderMobile from '@src/components/graphics/spaghetti-holder-mobile'
import SpaghettiHolderDesktop from '@src/components/graphics/spaghetti-holder-desktop'

// import chromium from '@sparticuz/chromium'
// import { marpCli, waitForObservation } from '@marp-team/marp-cli'
// import puppeteerCore from 'puppeteer-core'
// import puppeteer from 'puppeteer'
// import { NextRequest, NextResponse } from 'next/server'
// import { PDFViewer } from '@react-pdf/renderer'

export default async function AboutLayout({
  children,
}: {
  children: React.ReactNode
}) {

  const userAgent = (await headers()).get('user-agent') || ''
  const mobileCheck = isMobile(userAgent)

  // async function getSlide() {

  //   // async function getBrowser() {
  //   //   if (process.env.FLEX_MODE === 'production') {
  //   //     const executablePath = await chromium.executablePath();
  //   //     const browser = await puppeteerCore.launch({
  //   //       args: chromium.args,
  //   //       defaultViewport: chromium.defaultViewport,
  //   //       executablePath,
  //   //       // @ts-expect-error
  //   //       headless: chromium.headless,
  //   //     });
  //   //     return browser;
  //   //   } else {
  //   //     const browser = await puppeteer.launch();
  //   //     return browser;
  //   //   }
  //   // }

  //   // const targetPort = '8080';

  //   // Store the original environment variable
  //   // const { CHROME_PATH, PORT } = process.env
  //   const { CHROME_PATH } = process.env

  //   try {
  //     // Set the CHROME_PATH environment variable to the path of the Chromium binary
  //     process.env.CHROME_PATH = await chromium.executablePath();

  //     // detect(Number(targetPort))
  //     //   .then(async(realPort) => {
  //     //     if (Number(targetPort) == Number(realPort)) {
  //     //       process.env.PORT = targetPort;
  //     //       await marpCli(['--server', `${__dirname}/../../slides/`])
  //     //         .then((exitCode) => console.log(`Done with exit code ${exitCode}`))
  //     //         .catch(console.error)

  //     //       // waitForObservation().then(({ stop }) => {
  //     //       //   console.log('Observed')
  //     //       //   // Stop observations to resolve marpCli()'s Promise
  //     //       //   stop()
  //     //       // })

  //     //       // const browser = await getBrowser();
  //     //       // const page = await browser.newPage();
  //     //       // await page.goto(`http://localhost:${targetPort}/PITCHME.md`, { waitUntil: 'networkidle0' });
  //     //       // // const pdf = await page.pdf();
  //     //       // // Getting the page source HTML
  //     //       // const pageSourceHTML = await page.content();
  //     //       // await browser.close();

  //     //       // return pageSourceHTML;

  //     //     } else {
  //     //       console.log(`Port ${targetPort} is already in use. Please choose a different port.`);
  //     //     }
  //     //   })
  //     //   .catch(err => {
  //     //     console.log(err)
  //     //   })

  //     // let tmpDir;
  //     // const appPrefix = 'marp-slides-app';
  //     // try {
  //     //   tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), appPrefix));
  //     //   // the rest of your app goes here
  //     //   const tempMarkdownPath = path.join(tmpDir, `/${uuidv4()}.md`)
  //     //   writeFileSync(tempMarkdownPath, `${__dirname}/../../slides/PITCHME.md`)
  //     //   const tempPdfPath = path.join(tmpDir, `/${uuidv4()}.pdf`)
  //     //   await marpCli([tempMarkdownPath, '--pdf', '--output', tempPdfPath])
  //     // }
  //     // catch {
  //     //   // handle error
  //     // }
  //     // finally {
  //     //   try {
  //     //     if (tmpDir) {
  //     //       fs.rmSync(tmpDir, { recursive: true });
  //     //     }
  //     //   }
  //     //   catch (e) {
  //     //     console.error(`An error has occurred while removing the temp folder at ${tmpDir}. Please remove it manually. Error: ${e}`);
  //     //   }
  //     // }

  //     await marpCli([
  //       '--input-dir', `${__dirname}/../../slides/`,
  //       '-o', `${__dirname}/../../../public/slides`
  //     ])
  //       .then((exitCode) => console.log(`Done with exit code ${exitCode}`))
  //       .catch(console.error)

  //     waitForObservation().then(({ stop }) => {
  //       console.log('Observed')
  //       // Stop observations to resolve marpCli()'s Promise
  //       stop()
  //     })

  //   } finally {
  //     // Restore the original environment variable
  //     process.env.CHROME_PATH = CHROME_PATH
  //     // process.env.PORT = PORT
  //   }
  // }
  // await getSlide()

  return (
    <div className={classNames(
        flexStyles.genericLayout1,
        stylesPage.aboutApp,
        mobileCheck && `mobileMode__${process.env.NEXT_PUBLIC_BUILD_ID}`
      )}>
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
          {/* <div id={stylesPage.spaghettiBg} /> */}
          {!mobileCheck && (
            <>
              <SpaghettiHolderMobile />
              <SpaghettiHolderDesktop />
            </>
          )}
          {/*
          <SpaghettiHolderMobile />
          <SpaghettiHolderDesktop />
          */}
          <LogoAPE />
        </div>
      </div>

      <main className={flexStyles.fullPage}>
        <div className={stylesPage.titleHolder}>
          <Title level={TitleLevel.LEVEL2} className={classNames(flexStyles.isCentered)} style={{ margin: '0' }}>
            {`À propos de ce site`}
          </Title>
          {!mobileCheck && (
            <Text className={classNames(flexStyles.hasTextCentered, flexStyles.isItalic)} style={{ margin: '0.5rem auto 0' }}>
              {`Décortiquons ensemble ce sac de noeuds`}
            </Text>
          )}
          {/*
          <Text className={classNames(flexStyles.hasTextCentered, flexStyles.isItalic)} style={{ margin: '0.5rem auto 0' }}>
            {`Décortiquons ensemble ce sac de noeuds`}
          </Text>
          */}
        </div>
        <section className={classNames(
          stylesPage.sectionAbout, flexStyles.isFullwidth,
          !mobileCheck && `showSpagehetti__${process.env.NEXT_PUBLIC_BUILD_ID}`
        )}>
          {children}
        </section>
      </main>
    </div>
  )
}
