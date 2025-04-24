import React from 'react'
import { observer } from 'mobx-react-lite'
// import { getStores } from '@flexiness/domain-store'
// import classNames from 'classnames'
import { default as stylesPage } from '@src/styles/scss/pages/about.module.scss'

import LinePaths from '@src/components/graphics/DynamicLineMobile';

// const stores = getStores()

const SpaghettiHolderMobile = observer(() => {
  // const { spaghettiContext } = stores.SpaghettiStore
  return (
  <div className={stylesPage.spaghettiHolderMobile}>
    <LinePaths id={'spaghetti-dynamic-lines-mobile'} viewBoxWidth={646} viewBoxHeight={761} preserveAspectRatio={'none'} />
    {/* <svg className={stylesPage.spaghettiInlineLeft} width="380" height="100%" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <symbol id="mob-red-top-left" width="1018" height="1607" viewBox="0 0 1018 1607" preserveAspectRatio="xMinYMin" fill="none">
          <path d="M242.499 281.002C242.499 281.002 242.999 281.002 180.499 281.002C117.999 281.002 91.9991 253.001 91.9991 203.001C91.9991 153.001 91.9991 120.421 91.9991 76.0014C91.9991 26 121.5 5.99998 158 5.99998C194.5 5.99998 222.5 26 222.5 76.0014C222.5 126.003 222.5 151.501 180.499 151.501C138.498 151.501 115.5 151.501 115.5 151.501C31.3088 151.501 7.00012 179.001 7.00012 236.501" stroke="#FF0000" strokeWidth="10"/>
        </symbol>
        <symbol id="mob-blue-top-left" width="1018" height="1607" viewBox="0 0 1018 1607" preserveAspectRatio="xMinYMin" fill="none">
          <path d="M43.0591 462.5C43.059 362.5 74 328 101 328.5C128 329 157.5 359.5 157.5 462.5C157.5 565.5 204 567.501 255.5 567.501C381.5 567.501 382.5 602 510 602" stroke="#324BF7" strokeWidth="10"/>
        </symbol>
        <symbol id="mob-yellow-top-left" width="1018" height="1607" viewBox="0 0 1018 1607" preserveAspectRatio="xMinYMin" fill="none">
          <path d="M282 459.001C189.909 459.001 118 459.001 95.5006 459.001C73.0011 459.001 37.4997 438 37.4997 391.5C37.4997 345 37.4997 364 37.4997 285.5C37.4997 207 151 197.5 151 108C151 18.5 37.4997 15.5 37.4997 108C37.4997 200.5 130 214 181.5 246C233 278 233 391.5 142 404C51 416.5 45.7642 293 142 305C238.236 317 202 517 273 517C344 517 396.5 557.5 519.5 557" stroke="#D3CC5B" strokeWidth="10"/>
        </symbol>
        <symbol id="mob-red-center-left" width="1018" height="1607" viewBox="0 0 1018 1607" preserveAspectRatio="xMinYMid" fill="none">
          <path d="M79.4986 1049.5C79.4986 1049.5 8.5 1056 7.00012 962.501" stroke="#FF0000" strokeWidth="10"/>
        </symbol>
        <symbol id="mob-blue-center-left" width="1018" height="1607" viewBox="0 0 1018 1607" preserveAspectRatio="xMinYMid" fill="none">
          <path d="M433.499 771.5C257 771.5 226.5 859.5 143.5 859.5C83.1521 859.5 43.059 829 43.059 771.5" stroke="#324BF7" strokeWidth="10"/>
        </symbol>
        <symbol id="mob-yellow-bottom-left" width="1018" height="1607" viewBox="0 0 1018 1607" preserveAspectRatio="xMinYMax" fill="none">
          <path d="M233 1267.5C136 1267.5 130.236 1233 130.236 1185C130.236 1118 130.236 1049.7 130.236 947.001C130.236 850.501 238.236 851.001 238.236 947.001C238.236 1008 234.5 1025 130.236 1025C130.236 1025 162 1025 73.0001 1025C-15.9999 1025 -12.9999 1133 73.0001 1133C159 1133 363 1133 363 1133" stroke="#D3CC5B" strokeWidth="10"/>
        </symbol>
        <symbol id="mob-green-bottom-left" width="1018" height="1607" viewBox="0 0 1018 1607" preserveAspectRatio="xMinYMax" fill="none">
          <path d="M203 1191C203 1191 329 1191 488.5 1191M203 1191C76.2377 1193.64 80.9409 1129.5 111 1078C141.06 1026.5 163.5 993.5 214.5 918.501C265.5 843.502 213 776.001 154 776.001C95.0002 776.001 56.0003 855.001 102 918.501C148 982.001 262.5 969.001 346 969.001C346 969.001 405.5 969.001 549.5 969.001M203 1191H488.5M488.5 1308C648 1308 654 1264.5 654 1250.5C654 1236.5 648 1191 488.5 1191M488.5 1308C329 1308 264 1308 264 1308M488.5 1308H264M264 1308C264 1308 119.5 1308 87 1308M264 1308H87M87 1308C41 1308 18 1327 18 1379.5C18 1432 40 1457 87 1453.5" stroke="#39A256" strokeWidth="10"/>
        </symbol>
      </defs>
      {spaghettiContext.routes['pourquoi-ce-site'].status !== 'read' && (
        <>
          <use href="#mob-green-bottom-left" x="5" y="0" width="100%" height="100%" />
          <rect id={stylesPage.mobGreenRectHorizontalBottomLeftOne} x="0" y="0" width="100%" height="3.5" rx="2" fill="#39A256" />
        </>
      )}
      {spaghettiContext.routes['dans-quel-but'].status !== 'read' && (
        <>
          <use href="#mob-blue-top-left" x="10" y="10" width="100%" height="100%" />
          <use href="#mob-blue-center-left" x="10" y="0" width="100%" height="100%" />
          <rect id={stylesPage.mobBlueRectVerticalTopLeft} x="0" y="0" width="3.5" height="100%" rx="2" fill="#324BF7" />
          <rect id={stylesPage.mobBlueRectHorizontalTopLeftOne} x="0" y="0" width="100%" height="3.5" rx="2" fill="#324BF7" />
          <rect id={stylesPage.mobBlueRectHorizontalTopLeftTwo} x="0" y="0" width="100%" height="3.5" rx="2" fill="#324BF7" />
        </>
      )}
      {spaghettiContext.routes['qu-est-ce-que-c-est'].status !== 'read' && (
        <>
          <use href="#mob-yellow-top-left" x="calc(15vw - 50px)" y="0" width="100%" height="100%" />
          <use href="#mob-yellow-bottom-left" x="10" y="0" width="100%" height="100%" />
          <rect id={stylesPage.mobYellowRectHorizontalTopLeftOne} x="0" y="0" width="100%" height="3.5" rx="2" fill="#D3CC5B" />
          <rect id={stylesPage.mobYellowRectHorizontalTopLeftTwo} x="0" y="0" width="100%" height="3.5" rx="2" fill="#D3CC5B" />
          <rect id={stylesPage.mobYellowRectHorizontalTopLeftThree} x="0" y="0" width="100%" height="3.5" rx="2" fill="#D3CC5B" />
          <rect id={stylesPage.mobYellowRectHorizontalTopLeftFour} x="0" y="0" width="100%" height="3.5" rx="2" fill="#D3CC5B" />
          <rect id={stylesPage.mobYellowRectHorizontalBottomLeftOne} x="0" y="0" width="100%" height="3.5" rx="2" fill="#D3CC5B" />
          <rect id={stylesPage.mobYellowRectHorizontalBottomLeftTwo} x="0" y="0" width="100%" height="3.5" rx="2" fill="#D3CC5B" />
        </>
      )}
      {spaghettiContext.routes['comment-contribuer'].status !== 'read' && (
        <>
          <use href="#mob-red-top-left" x="10" y="10" width="100%" height="100%" />
          <use href="#mob-red-center-left" x="10" y="0" width="100%" height="100%" />
          <rect id={stylesPage.mobRedRectVerticalTopLeft} x="0" y="0" width="3.5" height="100%" rx="2" fill="#FF0000" />
          <rect id={stylesPage.mobRedRectHorizontalTopLeftOne} x="0" y="0" width="100%" height="3.5" rx="2" fill="#FF0000" />
          <rect id={stylesPage.mobRedRectHorizontalCenterLeftOne} x="0" y="0" width="100%" height="3.5" rx="2" fill="#FF0000" />
        </>
      )}
    </svg>
    <svg className={stylesPage.spaghettiInlineCenter} width="380" height="100%" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <symbol id="mob-red-center-center" width="1018" height="1607" viewBox="0 0 1018 1607" preserveAspectRatio="xMidYMid" fill="none">
          <path d="M303.5 1049.5C361 1049.5 444.5 1032 444.5 962.501C444.5 893.001 333.5 886.501 333.5 962.501C333.5 1038.5 436.5 1049.5 472.5 1049.5C508.5 1049.5 537 1049.5 628.5 1049.5C720 1049.5 681 909.501 770.343 909.501" stroke="#FF0000" strokeWidth="10"/>
        </symbol>
        <symbol id="mob-blue-center-center" width="1018" height="1607" viewBox="0 0 1018 1607" preserveAspectRatio="xMidYMid" fill="none">
          <path d="M802 979C635.502 979 609.999 771.5 433.499 771.5M314.999 1086.5C314.999 962.501 157.5 963.501 157.5 1086.5M802 792.5C700.026 792.5 646.5 888.5 549.5 944.5C452.5 1000.5 458 1053.5 458 1086.5" stroke="#324BF7" strokeWidth="10"/>
        </symbol>
        <symbol id="mob-blue-bottom-center" width="1018" height="1607" viewBox="0 0 1018 1607" preserveAspectRatio="xMidYMax" fill="none">
          <path d="M458 1131C458 1273 314.999 1279 314.999 1131M157.5 1209.5C157.5 1301.07 157.5 1239.92 157.5 1263C157.5 1315.5 195 1357 242.499 1357C289.999 1357 259.499 1357 373.499 1357C487.499 1357 487 1397 487.499 1485.5C487.998 1574 487.499 1598.5 433.499 1601" stroke="#324BF7" strokeWidth="10"/>
        </symbol>
        <symbol id="mob-yellow-bottom-center" width="1018" height="1607" viewBox="0 0 1018 1607" preserveAspectRatio="xMidYMax" fill="none">
          <path d="M816.5 1267.5C733.5 1267.5 233 1267.5 233 1267.5M363 1133C529.5 1133 510.5 1063 510.5 892.501C510.5 787.001 642.5 793.001 642.5 892.501C642.5 956.001 673 946.001 805 946.001M684 1133C586 1133 551 1195 551 1317C551 1317 551 1423 551 1510.75C551 1598.5 583 1599.5 614 1599.5" stroke="#D3CC5B" strokeWidth="10"/>
        </symbol>
      </defs>
      {spaghettiContext.routes['pourquoi-ce-site'].status !== 'read' && (
        <>
          <rect id={stylesPage.mobGreenRectHorizontalTopCenter} x="0" y="0" width="100%" height="3.5" rx="2" fill="#39A256" />
          <rect id={stylesPage.mobGreenRectHorizontalBottomCenterOne} x="0" y="0" width="100%" height="3.5" rx="2" fill="#39A256" />
          <rect id={stylesPage.mobGreenRectHorizontalBottomCenterTwo} x="0" y="0" width="100%" height="3.5" rx="2" fill="#39A256" />
        </>
      )}
      {spaghettiContext.routes['dans-quel-but'].status !== 'read' && (
        <>
          <use href="#mob-blue-center-center" x="0" y="0" width="100%" height="100%" />
          <use href="#mob-blue-bottom-center" x="0" y="0" width="100%" height="100%" />
          <rect id={stylesPage.mobBlueRectVerticalOneCenter} x="0" y="0" width="3.5" height="100%" rx="2" fill="#324BF7" />
          <rect id={stylesPage.mobBlueRectVerticalTwoCenter} x="0" y="0" width="3.5" height="100%" rx="2" fill="#324BF7" />
          <rect id={stylesPage.mobBlueRectVerticalThreeCenter} x="0" y="0" width="3.5" height="100%" rx="2" fill="#324BF7" />
          <rect id={stylesPage.mobBlueRectHorizontalTopCenterOne} x="0" y="0" width="100%" height="3.5" rx="2" fill="#324BF7" />
          <rect id={stylesPage.mobBlueRectHorizontalTopCenterTwo} x="0" y="0" width="100%" height="3.5" rx="2" fill="#324BF7" />
          <rect id={stylesPage.mobBlueRectHorizontalTopCenterThreeA} x="0" y="0" width="100%" height="3.5" rx="2" fill="#324BF7" />
          <rect id={stylesPage.mobBlueRectHorizontalTopCenterThreeB} x="0" y="0" width="100%" height="3.5" rx="2" fill="#324BF7" />
          <rect id={stylesPage.mobBlueRectHorizontalCenterCenterOneA} x="0" y="0" width="100%" height="3.5" rx="2" fill="#324BF7" />
          <rect id={stylesPage.mobBlueRectHorizontalCenterCenterOneB} x="0" y="0" width="100%" height="3.5" rx="2" fill="#324BF7" />
          <rect id={stylesPage.mobBlueRectHorizontalCenterCenterOneC} x="0" y="0" width="100%" height="3.5" rx="2" fill="#324BF7" />
        </>
      )}
      {spaghettiContext.routes['qu-est-ce-que-c-est'].status !== 'read' && (
        <>
          <use href="#mob-yellow-bottom-center" x="0" y="0" width="100%" height="100%" />
          <rect id={stylesPage.mobYellowRectHorizontalTopCenterOne} x="0" y="0" width="100%" height="3.5" rx="2" fill="#D3CC5B" />
          <rect id={stylesPage.mobYellowRectHorizontalTopCenterTwo} x="0" y="0" width="100%" height="3.5" rx="2" fill="#D3CC5B" />
          <rect id={stylesPage.mobYellowRectHorizontalTopCenterThree} x="0" y="0" width="100%" height="3.5" rx="2" fill="#D3CC5B" />
          <rect id={stylesPage.mobYellowRectHorizontalBottomCenterOne} x="0" y="0" width="100%" height="3.5" rx="2" fill="#D3CC5B" />
          <rect id={stylesPage.mobYellowRectHorizontalBottomCenterTwoA} x="0" y="0" width="100%" height="3.5" rx="2" fill="#D3CC5B" />
          <rect id={stylesPage.mobYellowRectHorizontalBottomCenterTwoB} x="0" y="0" width="100%" height="3.5" rx="2" fill="#D3CC5B" />
          <rect id={stylesPage.mobYellowRectHorizontalBottomCenterThreeA} x="0" y="0" width="100%" height="3.5" rx="2" fill="#D3CC5B" />
          <rect id={stylesPage.mobYellowRectHorizontalBottomCenterThreeB} x="0" y="0" width="100%" height="3.5" rx="2" fill="#D3CC5B" />
        </>
      )}
      {spaghettiContext.routes['comment-contribuer'].status !== 'read' && (
        <>
          <use href="#mob-red-center-center" x="10" y="0" width="100%" height="100%" />
          <rect id={stylesPage.mobRedRectHorizontalCenterCenterOne} x="0" y="0" width="100%" height="3.5" rx="2" fill="#FF0000" />
          <rect id={stylesPage.mobRedRectHorizontalCenterCenterTwo} x="0" y="0" width="100%" height="3.5" rx="2" fill="#FF0000" />
          <rect id={stylesPage.mobRedRectHorizontalCenterCenterThreeFixed} x="0" y="0" width="100%" height="3.5" rx="2" fill="#FF0000" />
        </>
      )}
    </svg>
    <svg className={stylesPage.spaghettiInlineRight} width="380" height="100%" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <symbol id="mob-blue-top-right" width="1018" height="1607" viewBox="0 0 1018 1607" preserveAspectRatio="xMaxYMin" fill="none">
          <path d="M809.498 279.001C809.498 279.001 788.498 279.001 851.998 279.001C915.498 279.001 974.998 237.501 974.998 176.001C974.998 114.5 885.498 116 885.498 176.001C885.498 236.001 915.998 250.501 974.998 299.001C1034 347.5 1011.5 402 972.498 401.5C933.498 401 891.404 345.019 858.498 375.501C806.754 423.433 1016.5 509.5 979.498 567.501C942.499 625.501 900 554.222 784 555C668 555.778 637.5 602 510 602" stroke="#324BF7" strokeWidth="10"/>
        </symbol>
        <symbol id="mob-yellow-top-right" width="1018" height="1607" viewBox="0 0 1018 1607" preserveAspectRatio="xMaxYMin" fill="none">
          <path d="M1012 459.001C1012 349 940.265 317 905 317C835 317 805 373.5 805 403.5C805 433.5 805 459.001 805 459.001C805 459.001 816.5 517 739 517C661.5 517 642.5 556.5 519.5 557" stroke="#D3CC5B" strokeWidth="10"/>
        </symbol>
        <symbol id="mob-green-top-right" width="1018" height="1607" viewBox="0 0 1018 1607" preserveAspectRatio="xMaxYMin" fill="none">
          <path d="M751.5 459H785C785 459 855 459 855 358C855 269.741 855 104.5 855 51.9999C855 -0.499989 939.5 -2.49999 939.5 51.9999C939.5 106.5 939.5 389.5 939.5 431C939.5 472.5 930.5 544.5 869.5 576.5C780 622 747.5 519.5 830.5 498.5C913.5 477.5 975 560 975 671.5" stroke="#39A256" strokeWidth="10"/>
        </symbol>
        <symbol id="mob-red-center-right" width="1018" height="1607" viewBox="0 0 1018 1607" preserveAspectRatio="xMaxYMid" fill="none">
          <path d="M906.5 1099C906.5 1012.5 906.5 1060.5 906.5 1009.5C906.5 958.498 894.5 909.501 831.5 909.263" stroke="#FF0000" strokeWidth="10"/>
        </symbol>
        <symbol id="mob-blue-center-right" width="1018" height="1607" viewBox="0 0 1018 1607" preserveAspectRatio="xMaxYMid" fill="none">
          <path d="M802 979C968.498 979 968.498 792.5 802 792.5" stroke="#324BF7" strokeWidth="10"/>
        </symbol>
        <symbol id="mob-yellow-bottom-right" width="1018" height="1607" viewBox="0 0 1018 1607" preserveAspectRatio="xMaxYMax" fill="none">
          <path d="M816.5 1267.5C979.639 1267.5 1012 1171 1012 1093M850.5 946.001C977 946.001 979.5 1133 850.5 1133H684" stroke="#D3CC5B" strokeWidth="10"/>
        </symbol>
        <symbol id="mob-red-bottom-right" width="1018" height="1607" viewBox="0 0 1018 1607" preserveAspectRatio="xMaxYMax" fill="none">
          <path d="M906.5 1099C906.5 1185.5 919.5 1304.5 831.5 1337.5C743.5 1370.5 672.343 1263 770.343 1208.5C868.343 1154 1002.5 1236 1002.5 1321.5C1002.5 1407 1002.5 1386 1002.5 1386C1002.5 1453.72 979 1460 936.5 1460" stroke="#FF0000" strokeWidth="10"/>
        </symbol>
        <symbol id="mob-green-bottom-right" width="1018" height="1607" viewBox="0 0 1018 1607" preserveAspectRatio="xMaxYMax" fill="none">
          <path d="M975 671.5C975 783 975 884 975 951C975 1018 991.502 1074.5 823.501 1074C655.5 1073.5 693.5 969.001 549.5 969.001" stroke="#39A256" strokeWidth="10"/>
        </symbol>
      </defs>
      {spaghettiContext.routes['pourquoi-ce-site'].status !== 'read' && (
        <>
          <use href="#mob-green-top-right" x="-15" y="0" width="100%" height="100%" />
          <use href="#mob-green-bottom-right" x="-15" y="0" width="100%" height="100%" />
          <rect id={stylesPage.mobGreenRectVerticalRight} x="0" y="0" width="3.5" height="100%" rx="2" fill="#39A256" />
          <rect id={stylesPage.mobGreenRectHorizontalTopRight} x="0" y="0" width="100%" height="3.5" rx="2" fill="#39A256" />
          <rect id={stylesPage.mobGreenRectHorizontalBottomRight} x="0" y="0" width="100%" height="3.5" rx="2" fill="#39A256" />
        </>
      )}
      {spaghettiContext.routes['dans-quel-but'].status !== 'read' && (
        <>
          <use href="#mob-blue-top-right" x="calc((20vw - 70px) * -1)" y="10" width="100%" height="100%" />
          <use href="#mob-blue-center-right" x="-17.5" y="0" width="100%" height="100%" />
          <rect id={stylesPage.mobBlueRectHorizontalTopRightOne} x="0" y="0" width="100%" height="3.5" rx="2" fill="#324BF7" />
          <rect id={stylesPage.mobBlueRectHorizontalTopRightTwo} x="0" y="0" width="100%" height="3.5" rx="2" fill="#324BF7" />
          <rect id={stylesPage.mobBlueRectHorizontalTopRightThree} x="0" y="0" width="100%" height="3.5" rx="2" fill="#324BF7" />
          <rect id={stylesPage.mobBlueRectHorizontalTopRightFour} x="0" y="0" width="100%" height="3.5" rx="2" fill="#324BF7" />
          <rect id={stylesPage.mobBlueRectHorizontalCenterRightOne} x="0" y="0" width="100%" height="3.5" rx="2" fill="#324BF7" />
          <rect id={stylesPage.mobBlueRectHorizontalCenterRightTwo} x="0" y="0" width="100%" height="3.5" rx="2" fill="#324BF7" />
        </>
      )}
      {spaghettiContext.routes['qu-est-ce-que-c-est'].status !== 'read' && (
        <>
          <use href="#mob-yellow-top-right" x="-10" y="0" width="100%" height="100%" />
          <use href="#mob-yellow-bottom-right" x="-10" y="0" width="100%" height="100%" />
          <rect id={stylesPage.mobYellowRectVerticalRight} x="0" y="0" width="3.5" height="100%" rx="2" fill="#D3CC5B" />
          <rect id={stylesPage.mobYellowRectHorizontalTopRight} x="0" y="0" width="100%" height="3.5" rx="2" fill="#D3CC5B" />
          <rect id={stylesPage.mobYellowRectHorizontalBottomRightOne} x="0" y="0" width="100%" height="3.5" rx="2" fill="#D3CC5B" />
          <rect id={stylesPage.mobYellowRectHorizontalBottomRightTwo} x="0" y="0" width="100%" height="3.5" rx="2" fill="#D3CC5B" />
          <rect id={stylesPage.mobYellowRectHorizontalBottomRightThree} x="0" y="0" width="100%" height="3.5" rx="2" fill="#D3CC5B" />
        </>
      )}
      {spaghettiContext.routes['comment-contribuer'].status !== 'read' && (
        <>
          <use href="#mob-red-center-right" x="-15" y="0" width="100%" height="100%" />
          <use href="#mob-red-bottom-right" x="-15" y="0" width="100%" height="100%" />
          <rect id={stylesPage.mobRedRectVerticalRight} x="0" y="0" width="3.5" height="100%" rx="2" fill="#FF0000" />
          <rect id={stylesPage.mobRedRectHorizontalCenterRight} x="0" y="0" width="100%" height="3.5" rx="2" fill="#FF0000" />
        </>
      )}
    </svg> */}
  </div>
)})

export default SpaghettiHolderMobile
