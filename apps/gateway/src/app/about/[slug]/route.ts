import { NextRequest, NextResponse } from 'next/server';
import puppeteerCore from 'puppeteer-core';
import puppeteer from 'puppeteer';
import chromium from '@sparticuz/chromium';

export const dynamic = 'force-dynamic';

async function getBrowser() {
  if (process.env.FLEX_MODE === 'production') {
    const executablePath = await chromium.executablePath();

    const browser = await puppeteerCore.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath,
      // @ts-expect-error
      headless: chromium.headless,
    });
    return browser;
  } else {
    const browser = await puppeteer.launch();
    return browser;
  }
}

export async function GET(request: NextRequest) {
  const browser = await getBrowser();

  const page = await browser.newPage();
  await page.goto('http://localhost:8080/PITCHME.md', { waitUntil: 'networkidle0' });
  const pdf = await page.pdf();
  await browser.close();
  return new NextResponse(pdf, {
    headers: {
      'Content-Type': 'application/pdf',
    },
  });
}
