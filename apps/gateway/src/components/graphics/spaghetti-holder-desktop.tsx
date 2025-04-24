'use client'

import React from 'react'
import { observer } from 'mobx-react-lite'
// import { getStores } from '@flexiness/domain-store'
// import classNames from 'classnames'
import { default as stylesPage } from '@src/styles/scss/pages/about.module.scss'

import LinePaths from '@src/components/graphics/DynamicLineDesktop';

// const stores = getStores()

const SpaghettiHolderDesktop = observer(() => {
  // const { spaghettiContext } = stores.SpaghettiStore
  return (
  <div className={stylesPage.spaghettiHolderDesktop}>
    <LinePaths id={'spaghetti-dynamic-lines-desk'} viewBoxWidth={2650} viewBoxHeight={1521} preserveAspectRatio={'none'} />
    {/*
    <svg className={stylesPage.spaghettiInlineLeft} width="900" height="100%" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <symbol id="desk-green-bottom-left" width="2650" height="1520" viewBox="0 0 2650 1520" preserveAspectRatio="xMinYMax" fill="none">
          <path d="M874.501 1308C627.582 1312 610.001 1130 610.001 1035C610.001 972.811 582.5 939.001 510.5 939.001H387C303.5 939.001 189 952.001 143 888.501C97.0003 825.001 156 746.001 215 746.001C274 746.001 342.5 834.501 285.5 888.501L172 1018C123 1073.5 117.238 1213.64 244 1211C244 1211 291 1211 450.5 1211C610 1211 610.001 1274.5 610.001 1291C610.001 1307.5 610 1368 450.5 1368C291 1368 305 1368 305 1368C305 1368 175.5 1368 143 1368C97 1368 39 1387 39 1439.5C39 1492 96 1517 143 1513.5" stroke="#39A256" strokeWidth="12"/>
        </symbol>
        <symbol id="desk-yellow-top-left" width="2650" height="1520" viewBox="0 0 2650 1520" preserveAspectRatio="xMinYMin" fill="none">
          <path d="M476.501 479.001C363.001 479.001 346 336.001 484 336.001C622 336.001 614.5 232.001 614.5 128.001C614.5 24.0011 473.5 26.0011 476.501 128.001C476.501 128.001 476.501 122.001 476.501 163.501C476.501 207.614 497 244.501 553 244.501C656.5 244.501 701.236 359.166 701.236 424C701.236 801 6 801 6 424C6.00002 185 226.5 244.501 226.5 128.001C226.5 11.5012 79.5 5.60959 79.5 128.001C79.5 250.393 314 206.001 314 407.001C314 577.389 33.0005 577.501 33.0005 784.001" stroke="#D3CC5B" strokeWidth="12"/>
        </symbol>
        <symbol id="desk-yellow-bottom-left" width="2650" height="1520" viewBox="0 0 2650 1520" preserveAspectRatio="xMinYMax" fill="none">
          <path d="M374 1153C288 1153 285 1028 374 1028C463 1028 701.236 1028 701.236 1028C805.5 1028 846.236 1032.7 846.236 940.001C846.236 844.001 701.236 843.501 701.236 940.001C701.236 1042.7 701.236 1138 701.236 1205C701.236 1253 660.5 1287.5 565.5 1287.5C565.5 1287.5 382.019 1287.5 197.501 1287.5C34.3622 1287.5 33.0005 1191 33.0005 1113" stroke="#D3CC5B" strokeWidth="12"/>
        </symbol>
        <symbol id="desk-red-top-left" width="2650" height="1520" viewBox="0 0 2650 1520" preserveAspectRatio="xMinYMin" fill="none">
          <path d="M565 556.501C437.5 556.501 449.999 685.501 570 685.501C690 685.501 690 818.001 565 818.001C357 818.001 434.5 638.5 303 638.5C171.5 638.5 85.9998 550 85.9998 475C85.9998 400 85.9998 433.001 85.9998 433.001C85.9998 282.001 230 284.001 230 433.001C230 497 230 476.878 230 475C230 507.615 200.969 621.059 203.384 716" stroke="#FF0000" strokeWidth="12"/>
        </symbol>
        <symbol id="desk-red-bottom-left" width="2650" height="1520" viewBox="0 0 2650 1520" preserveAspectRatio="xMinYMax" fill="none">
          <path d="M920.499 1069.5C759.212 1069.5 678.893 1188.48 570 1069.5C530.501 1026.35 471 857.5 303 857.5C227.871 857.5 205.338 792.804 203.384 716" stroke="#FF0000" strokeWidth="12"/>
        </symbol>
      </defs>
      {spaghettiContext.routes['pourquoi-ce-site'].status !== 'read' && (
        <>
          <use href="#desk-green-bottom-left" className={stylesPage.useYAxisDesk} x="0" y="0" width="100%" height="100%" />
          <rect id={stylesPage.deskGreenRectHorizontalBottomLeft} x="0" y="0" width="100%" height="4" rx="2" fill="#39A256" />
          <rect id={stylesPage.deskGreenRectHorizontalBottomLink} x="0" y="0" width="100%" height="4" rx="2" fill="#39A256" />
        </>
      )}
      {spaghettiContext.routes['dans-quel-but'].status !== 'read' && (
        <>
        </>
      )}
      {spaghettiContext.routes['qu-est-ce-que-c-est'].status !== 'read' && (
        <>
          <use href="#desk-yellow-top-left" x="10" y="0" width="100%" height="100%" />
          <use href="#desk-yellow-bottom-left" className={stylesPage.useYAxisDesk} x="10" y="0" width="100%" height="100%" />
          <rect id={stylesPage.deskYellowRectHorizontalTopLeft} x="0" y="0" width="100%" height="4" rx="2" fill="#D3CC5B" />
          <rect id={stylesPage.deskYellowRectHorizontalBottomLeft} x="0" y="0" width="100%" height="4" rx="2" fill="#D3CC5B" />
          <rect id={stylesPage.deskYellowRectVerticalRight} x="0" y="0" width="4" height="100%" rx="2" fill="#D3CC5B" />
        </>
      )}
      {spaghettiContext.routes['comment-contribuer'].status !== 'read' && (
        <>
          <use href="#desk-red-top-left" x="50" y="45" width="100%" height="100%" />
          <use href="#desk-red-bottom-left" className={stylesPage.useYAxisDesk} x="50" y="0" width="100%" height="100%" />
          <rect id={stylesPage.deskRedRectHorizontalTopLeft} x="0" y="0" width="100%" height="4" rx="2" fill="#FF0000" />
          <rect id={stylesPage.deskRedRectHorizontalBottomLeft} x="0" y="0" width="100%" height="4" rx="2" fill="#FF0000" />
          <rect id={stylesPage.deskRedRectVerticalRight} x="0" y="0" width="4" height="100%" rx="2" fill="#FF0000" />
        </>
      )}
    </svg>
    <svg className={stylesPage.spaghettiInlineCenter} width="900" height="100%" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <symbol id="desk-yellow-bottom-center" width="2650" height="1520" viewBox="0 0 2650 1520" preserveAspectRatio="xMidYMax" fill="none">
          <path d="M1024 1153C1190.5 1153 1171.5 1083 1171.5 912.501C1171.5 807.001 1303.5 813.001 1303.5 912.501C1303.5 976.001 1334 976.001 1466 976.001C1466 976.001 1576.13 976.001 1791.5 976.001C1918 976.001 1920.5 1153 1791.5 1153H1525C1427 1153 1352 1153 1352 1275C1352 1275 1352 1332 1352 1419.75C1352 1507.5 1422.5 1507.5 1455 1507.5" stroke="#D3CC5B" strokeWidth="12"/>
        </symbol>
        <symbol id="desk-red-top-center" width="2650" height="1520" viewBox="0 0 2650 1520" preserveAspectRatio="xMidYMin" fill="none">
          <path d="M1003.5 301.001C1003.5 301.001 903.999 301.001 841.499 301.001C778.999 301.001 752.999 273.001 752.999 223.001C752.999 173.001 752.999 130.421 752.999 86.0014C752.999 -21.4986 932.5 -17.9986 932.5 86.0013C932.5 154.345 904.999 173.001 841.499 171.501L636.5 168.501C552.309 168.501 528 199.001 528 256.501C528 256.501 528 300.001 528 344.501C528 389.001 574 420.001 636.5 420.001C699 420.001 920.499 420.001 920.499 420.001C1017 420.001 1017 556.501 920.499 556.501C920.499 556.501 711 556.501 655 556.501C599 556.501 692.5 556.501 565 556.501" stroke="#FF0000" strokeWidth="12"/>
        </symbol>
        <symbol id="desk-red-bottom-center" width="2650" height="1520" viewBox="0 0 2650 1520" preserveAspectRatio="xMidYMax" fill="none">
          <path d="M920.499 1069.5C1101.51 1069.5 1215.5 1069.5 1421.5 1069.5C1571.89 1069.5 1675.5 1042 1675.5 972.501C1675.5 903.001 1564.5 896.501 1564.5 972.501C1564.5 1048.5 1645 1069.5 1925 1069.5" stroke="#FF0000" strokeWidth="12"/>
        </symbol>
        <symbol id="desk-blue-top-center" width="2650" height="1520" viewBox="0 0 2650 1520" preserveAspectRatio="xMidYMin" fill="none">
          <path d="M1610.5 299C1610.5 299 1769.5 299 1833 299C1896.5 299 1985 274.5 1985 196C1985 98.5005 1846.5 98.5005 1846.5 196C1846.5 269.5 1923 299 1996 299M2039.5 564.5C1818.5 557.501 1596.5 580 1596 472C1595.5 364 1753.8 395.375 1912 432.5C2007.07 454.81 2124.44 466.98 2236.5 466.722" stroke="#324BF7" strokeWidth="12"/>
        </symbol>
        <symbol id="desk-blue-bottom-center" width="2650" height="1520" viewBox="0 0 2650 1520" preserveAspectRatio="xMidYMax" fill="none">
          <path d="M1326.5 853.501C1235.5 853.501 1255.5 1009 1255.5 1151C1255.5 1293 1096 1299 1096 1151C1096 1003 1096 1050.5 1096 926.501C1096 802.5 938.5 803.501 938.5 926.501C938.5 995.423 938.5 1112.79 938.5 1229.5C938.5 1321.07 938.5 1259.92 938.5 1283C938.5 1335.5 976 1377 1023.5 1377C1071 1377 1090.5 1377 1144.5 1377C1198.5 1377 1259.5 1389 1259.5 1440.5C1259.5 1492 1199.5 1511 1144.5 1511" stroke="#324BF7" strokeWidth="12"/>
        </symbol>
      </defs>
      {spaghettiContext.routes['pourquoi-ce-site'].status !== 'read' && (
        <>
          <rect id={stylesPage.deskGreenRectHorizontalTopCenter} x="0" y="0" width="100%" height="4" rx="2" fill="#39A256" />
          <rect id={stylesPage.deskGreenRectHorizontalBottomCenterLeft} x="0" y="0" width="100%" height="4" rx="2" fill="#39A256" />
          <rect id={stylesPage.deskGreenRectHorizontalBottomCenterRight} x="0" y="0" width="100%" height="4" rx="2" fill="#39A256" />
        </>
      )}
      {spaghettiContext.routes['dans-quel-but'].status !== 'read' && (
        <>
          <use href="#desk-blue-top-center" x="20" y="45" width="100%" height="100%" />
          <use href="#desk-blue-bottom-center" className={stylesPage.useYAxisDesk} x="15" y="0" width="100%" height="100%" />
          <rect id={stylesPage.deskBlueRectHorizontalBottomCenter} x="0" y="0" width="100%" height="4" rx="2" fill="#324BF7" />
          <rect id={stylesPage.deskBlueRectHorizontalTopCenterOne} x="0" y="0" width="100%" height="4" rx="2" fill="#324BF7" />
          <rect id={stylesPage.deskBlueRectHorizontalTopCenterTwo} x="0" y="0" width="100%" height="4" rx="2" fill="#324BF7" />
          <rect id={stylesPage.deskBlueRectHorizontalTopCenterThree} x="0" y="0" width="100%" height="4" rx="2" fill="#324BF7" />
          <rect id={stylesPage.deskBlueRectHorizontalBottomCenterLink} x="0" y="0" width="100%" height="4" rx="2" fill="#324BF7" />
        </>
      )}
      {spaghettiContext.routes['qu-est-ce-que-c-est'].status !== 'read' && (
        <>
          <use href="#desk-yellow-bottom-center" className={stylesPage.useYAxisDesk} x="20" y="0" width="100%" height="100%" />
          <rect id={stylesPage.deskYellowRectHorizontalTopCenter} x="0" y="0" width="100%" height="4" rx="2" fill="#D3CC5B" />
          <rect id={stylesPage.deskYellowRectHorizontalBottomCenter} x="0" y="0" width="100%" height="4" rx="2" fill="#D3CC5B" />
          <rect id={stylesPage.deskYellowRectHorizontalBottomCenterLink} x="0" y="0" width="100%" height="4" rx="2" fill="#D3CC5B" />
        </>
      )}
      {spaghettiContext.routes['comment-contribuer'].status !== 'read' && (
        <>
          <use href="#desk-red-top-center" x="-10" y="45" width="100%" height="100%" />
          <use href="#desk-red-bottom-center" className={stylesPage.useYAxisDesk} x="0" y="0" width="100%" height="100%" />
          <rect id={stylesPage.deskRedRectHorizontalTopCenter} x="0" y="0" width="100%" height="4" rx="2" fill="#FF0000" />
          <rect id={stylesPage.deskRedRectHorizontalBottomCenterLeft} x="0" y="0" width="100%" height="4" rx="2" fill="#FF0000" />
          <rect id={stylesPage.deskRedRectHorizontalBottomCenterRight} x="0" y="0" width="100%" height="4" rx="2" fill="#FF0000" />
        </>
      )}
    </svg>
    <svg className={stylesPage.spaghettiInlineRight} width="900" height="100%" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <symbol id="desk-green-top-right" width="2650" height="1520" viewBox="0 0 2650 1520" preserveAspectRatio="xMaxYMin" fill="none">
          <path d="M1541.5 479H1572.5H1606C1606 479 1656 479 1656 378C1656 289.741 1656 229 1656 152C1656 74.9998 1750.5 71.9998 1750.5 152C1750.5 232 1750.5 277 1750.5 378C1750.5 479 1818 479 1818 479C1818 479 1820 479 1973 479C2126 479 2231.5 257 2231.5 152C2231.5 -11.0001 2057 -10.0001 2057 152C2057 260.5 2165.5 510 2294 510C2422.5 510 2443.5 510 2511 510C2578.5 510 2596 570.201 2596 609.5" stroke="#39A256" strokeWidth="12"/>
        </symbol>
        <symbol id="desk-green-bottom-right" width="2650" height="1520" viewBox="0 0 2650 1520" preserveAspectRatio="xMaxYMax" fill="none">
          <path d="M2379.2 828.013C2400.86 859.602 2413.5 900.569 2413.5 953C2413.5 1040 2453 1062.5 2511 1062.5C2569 1062.5 2596 1040 2596 953M2379.2 828.013C2328.77 754.477 2229.48 731.751 2127 733.5C1980.5 736 1980.5 928.5 2127 928.5C2229.48 928.5 2328.77 891.068 2379.2 828.013ZM2379.2 828.013C2400.86 800.925 2413.5 769.109 2413.5 733.5C2413.5 578.5 2204.5 609.5 2204.5 609.5H2035C1872.9 609.5 1845.03 843.5 1964.9 953C2084.76 1062.5 1980.1 1308 1818 1308" stroke="#39A256" strokeWidth="12"/>
        </symbol>
        <symbol id="desk-red-bottom-right" width="2650" height="1520" viewBox="0 0 2650 1520" preserveAspectRatio="xMaxYMax" fill="none">
          <path d="M2488.5 1502C2531 1502 2593.5 1486.72 2593.5 1419V1314.5C2593.5 1234.5 2488.5 1149 2303 1149C2117.5 1149 2117.5 1314.5 2303 1314.5C2488.5 1314.5 2593.5 1267 2593.5 1149C2593.5 1055 2593.5 1111 2593.5 1060C2593.5 1009 2551.5 939.501 2488.5 939.263C2488.5 939.263 2421.54 939.501 2407.34 939.501C2336 939.501 2350.5 1069.5 2192.5 1069.5" stroke="#FF0000" strokeWidth="12"/>
        </symbol>
        <symbol id="desk-blue-top-right" width="2650" height="1520" viewBox="0 0 2650 1520" preserveAspectRatio="xMaxYMin" fill="none">
          <path d="M1996 299C2014.91 299 2087.5 303.5 2139 348C2190.5 392.5 2315.16 795.788 2473.5 741.5C2656.7 678.686 2191.66 325.5 2319.5 175.5C2447.34 25.5005 2741.4 218 2610.5 375.5C2558.19 438.443 2403.22 466.337 2236.5 466.722M2039.5 564.501C2155.1 568.162 2223.5 647.069 2223.88 721.5" stroke="#324BF7" strokeWidth="12"/>
        </symbol>
        <symbol id="desk-blue-bottom-right" width="2650" height="1520" viewBox="0 0 2650 1520" preserveAspectRatio="xMaxYMax" fill="none">
          <path d="M1326.5 853.501C1417.5 853.501 1857.6 853.501 2039.5 853.501C2168.03 853.501 2224.23 789.361 2223.88 721.5" stroke="#324BF7" strokeWidth="12"/>
        </symbol>
      </defs>
      {spaghettiContext.routes['pourquoi-ce-site'].status !== 'read' && (
        <>
          <rect id={stylesPage.deskGreenRectHorizontalTopRight} x="0" y="0" width="100%" height="4" rx="2" fill="#39A256" />
          <use href="#desk-green-top-right" x="-20" y="0" width="100%" height="100%" />
          <rect id={stylesPage.deskGreenRectVerticalRight} x="-20" y="0" width="4" height="100%" rx="2" fill="#39A256" />
          <use href="#desk-green-bottom-right" className={stylesPage.useYAxisDesk} x="-20" y="0" width="100%" height="100%" />
          <rect id={stylesPage.deskGreenRectHorizontalBottomRight} x="0" y="0" width="100%" height="4" rx="2" fill="#39A256" />
        </>
      )}
      {spaghettiContext.routes['dans-quel-but'].status !== 'read' && (
        <>
          <use href="#desk-blue-top-right" x="-40" y="45" width="100%" height="100%" />
          <use href="#desk-blue-bottom-right" className={stylesPage.useYAxisDesk} x="-40" y="0" width="100%" height="100%" />
          <rect id={stylesPage.deskBlueRectHorizontalTopRightOne} x="0" y="0" width="100%" height="4" rx="2" fill="#324BF7" />
          <rect id={stylesPage.deskBlueRectHorizontalTopRightTwo} x="0" y="0" width="100%" height="4" rx="2" fill="#324BF7" />
          <rect id={stylesPage.deskBlueRectHorizontalTopRightThree} x="0" y="0" width="100%" height="4" rx="2" fill="#324BF7" />
          <rect id={stylesPage.deskBlueRectHorizontalBottomRight} x="0" y="0" width="100%" height="4" rx="2" fill="#324BF7" />
          <rect id={stylesPage.deskBlueRectVerticalRight} x="0" y="0" width="4" height="100%" rx="2" fill="#324BF7" />
        </>
      )}
      {spaghettiContext.routes['qu-est-ce-que-c-est'].status !== 'read' && (
        <>
        </>
      )}
      {spaghettiContext.routes['comment-contribuer'].status !== 'read' && (
        <>
          <use href="#desk-red-bottom-right" className={stylesPage.useYAxisDesk} x="-10" y="0" width="100%" height="100%" />
          <rect id={stylesPage.deskRedRectHorizontalBottomRight} x="0" y="0" width="100%" height="4" rx="2" fill="#FF0000" />
          <rect id={stylesPage.deskRedRectHorizontalBottomLink} x="0" y="0" width="100%" height="4" rx="2" fill="#FF0000" />
        </>
      )}
    </svg>
    */}
  </div>
)})

export default SpaghettiHolderDesktop
