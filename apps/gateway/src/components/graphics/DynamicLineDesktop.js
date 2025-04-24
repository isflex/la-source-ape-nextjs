'use client'

import React from 'react'
import { observer } from 'mobx-react-lite'
import MeasureAndRender from '@src/components/graphics/MeasureAndRender'
import { getStores } from '@flexiness/domain-store'
const stores = getStores()

import Panel from '@src/components/graphics/Panel'
import Matte from '@src/components/graphics/matteDesk'

const LinePaths = ({id, viewBoxWidth, viewBoxHeight, preserveAspectRatio}) => {
  const { spaghettiContext } = stores.SpaghettiStore

  const strokeSize = 4;
  const boundsXOffset = 20;
  const boundsYOffset = 10;
  const translateX = 0;
  const translateY = 0;
  const _preserveAspectRatio = preserveAspectRatio || 'none';
  const showMatte = false

  const styles = {
    position: 'relative',
    display: 'block',
    width: `calc(100% - ${boundsXOffset}px)`,
    height: '100%',
  };

  return (
    <div style={styles}>
      <MeasureAndRender stretch={true} debounce={1}>
        {bounds => {
          if (bounds.width <= (1024 - boundsXOffset)) return null;

          const boundsWidth = bounds.width;
          const boundsHeight = bounds.height;
          const ratio = 2.5;
          const scale = 0.4
          const canvasWidth = (boundsWidth * ratio) - strokeSize
          const canvasHeight = (boundsHeight * ratio) - strokeSize
          const svgWidth = canvasWidth - viewBoxWidth
          const svgHeight = canvasHeight - viewBoxHeight

          const green_xMin = 20
          const green_xMin1a = 20 + (boundsWidth * 0.1)
          const green_xMid = svgWidth / 2 + (boundsWidth * 0.1)
          const green_xMid2a = green_xMid + svgWidth / 6
          const green_xMid2b = svgWidth - svgWidth / 4 + 50
          const green_xMid2c = green_xMid + svgWidth / 4 - 70
          const green_xMax = svgWidth + 20
          const green_yMin = -25
          const green_yMid = svgHeight / 2
          const green_yMid2 = svgHeight / 2 + 150
          const green_yMax = svgHeight
          const green_yMax2a = svgHeight + 12

          const pathGreen = `

            M${1311.5 + green_xMid} ${376 + green_yMin}
            H${1516 + green_xMid}
            C${1516 + green_xMid} ${376 + green_yMin} ${1566 + green_xMid} ${376 + green_yMin} ${1566 + green_xMid} ${275 + green_yMin}
            C${1566 + green_xMid} ${289.741 + green_yMin} ${1566 + green_xMid} ${299 + green_yMin} ${1566 + green_xMid} ${222 + green_yMin}
            C${1566 + green_xMid} ${145 + green_yMin} ${1660.5 + green_xMid} ${142 + green_yMin} ${1660.5 + green_xMid} ${222 + green_yMin}
            C${1660.5 + green_xMid} ${302 + green_yMin} ${1660.5 + green_xMid} ${277 + green_yMin} ${1660.5 + green_xMid} ${378 + green_yMin}
            C${1660.5 + green_xMid} ${479 + green_yMin} ${1728 + green_xMid} ${479 + green_yMin} ${1728 + green_xMid} ${479 + green_yMin}

            L${1747.5 + green_xMid2a} ${479 + green_yMin}
            C${1747.5 + green_xMid2a} ${479 + green_yMin} ${1933 + green_xMid2a} ${480.268 + green_yMin} ${1933 + green_xMid2a} ${599.5 + green_yMin}
            C${1933 + green_xMid2a} ${701.5 + green_yMin} ${1770.5 + green_xMid2a} ${702.5 + green_yMin} ${1770.5 + green_xMid2a} ${599.5 + green_yMin}
            C${1770.5 + green_xMid2a} ${480.079 + green_yMin} ${1950 + green_xMid2a} ${479 + green_yMin} ${1950 + green_xMid2a} ${479 + green_yMin}

            L${2083 + green_xMid2b} ${479 + green_yMin}
            C${2236 + green_xMid2b} ${479 + green_yMin} ${2341.5 + green_xMid2b} ${317 + green_yMin} ${2341.5 + green_xMid2b} ${212 + green_yMin}
            C${2341.5 + green_xMid2b} ${48.9999 + green_yMin} ${2167 + green_xMid2b} ${49.9999 + green_yMin} ${2167 + green_xMid2b} ${212 + green_yMin}
            C${2167 + green_xMid2b} ${320.5 + green_yMin} ${2275.5 + green_xMid2b} ${510 + green_yMin} ${2404 + green_xMid2b} ${510 + green_yMin}

            L${2511 + green_xMax} ${510 + green_yMin}
            C${2578.5 + green_xMax} ${510 + green_yMin} ${2596 + green_xMax} ${570.201 + green_yMin} ${2596 + green_xMax} ${609.5 + green_yMin}

            L${2596 + green_xMax} ${671.5 + green_yMin}
            C${2596 + green_xMax} ${671.5 + green_yMid} ${2596 + green_xMax} ${833.5 + green_yMid} ${2501.5 + green_xMax} ${833.5 + green_yMid}
            C${2427.5 + green_xMax} ${834.5 + green_yMid} ${2421.5 + green_xMax} ${723 + green_yMid} ${2501.5 + green_xMax} ${723 + green_yMid}
            C${2596 + green_xMax} ${723 + green_yMid} ${2596 + green_xMax} ${884 + green_yMid} ${2596 + green_xMax} ${884 + green_yMid}

            L${2596 + green_xMax} ${929 + green_yMid2}
            V${954 + green_yMid2}
            C${2596 + green_xMax} ${1061.5 + green_yMid2} ${2506 + green_xMax} ${1061.5 + green_yMid2} ${2506 + green_xMax} ${1061.5 + green_yMid2}
            C${2506 + green_xMax} ${1061.5 + green_yMid2} ${2415 + green_xMax} ${1061.5 + green_yMid2} ${2415 + green_xMax} ${954 + green_yMid2}
            V${929 + green_yMid2}
            C${2415 + green_xMax} ${885 + green_yMax} ${2415 + green_xMax} ${726 + green_yMax} ${2133.5 + green_xMax} ${728 + green_yMax}
            C${1930 + green_xMax} ${728 + green_yMax} ${1930 + green_xMax} ${929 + green_yMax} ${2133.5 + green_xMax} ${929 + green_yMax}
            C${2415 + green_xMax} ${929 + green_yMax} ${2415 + green_xMax} ${760.5 + green_yMax} ${2415 + green_xMax} ${705.5 + green_yMax}
            C${2415 + green_xMax} ${609 + green_yMax} ${2312 + green_xMax} ${609 + green_yMax} ${2252.5 + green_xMax} ${609 + green_yMax}
            C${2193 + green_xMax} ${609 + green_yMax} ${2043.5 + green_xMax} ${609 + green_yMax} ${2017 + green_xMax} ${609 + green_yMax}
            C${1826.5 + green_xMax} ${609 + green_yMax} ${1797.5 + green_xMax} ${859.069 + green_yMax} ${1934 + green_xMax} ${925 + green_yMax}
            C${2150 + green_xMax} ${1029.33 + green_yMax} ${2026.5 + green_xMax} ${1308.5 + green_yMax} ${1826.5 + green_xMax} ${1308.5 + green_yMax}

            L${1744 + green_xMid2c} ${1308 + green_yMax}
            C${1744 + green_xMid2c} ${1308 + green_yMax} ${1483 + green_xMid2c} ${1308 + green_yMax} ${1482 + green_xMid2c} ${1177.5 + green_yMax}
            C${1482.5 + green_xMid2c} ${1073 + green_yMax} ${1622 + green_xMid2c} ${1070.5 + green_yMax} ${1622.5 + green_xMid2c} ${1177.5 + green_yMax}
            C${1622 + green_xMid2c} ${1308 + green_yMax} ${1373.5 + green_xMid2c} ${1308 + green_yMax} ${1373.5 + green_xMid2c} ${1308 + green_yMax}

            L${874.501 + green_xMin1a} ${1308 + green_yMax}
            C${627.581 + green_xMin1a} ${1312 + green_yMax} ${610 + green_xMin1a} ${1130 + green_yMax} ${610 + green_xMin1a} ${1035 + green_yMax}
            C${610 + green_xMin1a} ${972.812 + green_yMax} ${582.5 + green_xMin1a} ${939.001 + green_yMax} ${510.5 + green_xMin1a} ${939.001 + green_yMax}

            H${387 + green_xMin}
            C${303.5 + green_xMin} ${939.001 + green_yMax} ${189 + green_xMin} ${952.001 + green_yMax} ${143 + green_xMin} ${888.501 + green_yMax}
            C${96.9999 + green_xMin} ${825.001 + green_yMax} ${156 + green_xMin} ${746.001 + green_yMax} ${215 + green_xMin} ${746.001 + green_yMax}
            C${274 + green_xMin} ${746.001 + green_yMax} ${342.5 + green_xMin} ${834.501 + green_yMax} ${285.5 + green_xMin} ${888.501 + green_yMax}

            L${172 + green_xMin} ${1018 + green_yMax}
            C${123 + green_xMin} ${1073.5 + green_yMax} ${117.237 + green_xMin} ${1213.64 + green_yMax} ${244 + green_xMin} ${1211 + green_yMax}
            C${244 + green_xMin} ${1211 + green_yMax} ${291 + green_xMin} ${1211 + green_yMax} ${450.5 + green_xMin} ${1211 + green_yMax}
            C${610 + green_xMin} ${1211 + green_yMax} ${610 + green_xMin} ${1274.5 + green_yMax} ${610 + green_xMin} ${1291 + green_yMax}
            C${610 + green_xMin} ${1307.5 + green_yMax} ${610 + green_xMin} ${1368 + green_yMax} ${450.5 + green_xMin} ${1368 + green_yMax}
            C${291 + green_xMin} ${1368 + green_yMax} ${305 + green_xMin} ${1368 + green_yMax} ${305 + green_xMin} ${1368 + green_yMax}
            C${305 + green_xMin} ${1368 + green_yMax} ${175.5 + green_xMin} ${1368 + green_yMax} ${143 + green_xMin} ${1368 + green_yMax}
            C${96.9996 + green_xMin} ${1368 + green_yMax} ${38.9996 + green_xMin} ${1387 + green_yMax} ${38.9996 + green_xMin} ${1439.5 + green_yMax}
            C${38.9996 + green_xMin} ${1492 + green_yMax} ${95.9996 + green_xMin} ${1517 + green_yMax} ${143 + green_xMin} ${1513.5 + green_yMax}
            H${400 + green_xMin}

          `;

          const blue_xMin = svgWidth / 2 + (boundsWidth * 0.04)
          const blue_xMid = svgWidth / 2 + svgWidth / 12
          const blue_xMid2a = svgWidth / 2 + svgWidth / 5
          const blue_xMid2b = svgWidth / 2 + svgWidth / 10 + 50
          const blue_xMax = svgWidth - 30
          const blue_xMax2a = svgWidth - svgWidth / 12
          const blue_yMin = -58
          const blue_yMid = svgHeight / 2 - 150
          const blue_yMax = svgHeight
          const blue_yMax2a = svgHeight + 12

          const pathBlue = `

            M${1410.5 + blue_xMid} ${299 + blue_yMin}
            C${1410.5 + blue_xMid} ${299 + blue_yMin} ${1749.5 + blue_xMid} ${299 + blue_yMin} ${1813 + blue_xMid} ${299 + blue_yMin}
            C${1876.5 + blue_xMid} ${299 + blue_yMin} ${1965 + blue_xMid} ${274.5 + blue_yMin} ${1965 + blue_xMid} ${196 + blue_yMin}
            C${1965 + blue_xMid} ${98.5005 + blue_yMin} ${1826.5 + blue_xMid} ${98.5005 + blue_yMin} ${1826.5 + blue_xMid} ${196 + blue_yMin}
            C${1826.5 + blue_xMid} ${269.501 + blue_yMin} ${1903 + blue_xMid} ${299 + blue_yMin} ${1976 + blue_xMid} ${299 + blue_yMin}

            L${2061 + blue_xMax} ${299 + blue_yMin}
            C${2123 + blue_xMax} ${299 + blue_yMin} ${2227.5 + blue_xMax} ${321.5 + blue_yMin} ${2290 + blue_xMax} ${434.5 + blue_yMin}
            C${2352.5 + blue_xMax} ${547.5 + blue_yMin} ${2334.5 + blue_xMax} ${783.5 + blue_yMin} ${2472 + blue_xMax} ${747.5 + blue_yMin}
            C${2605.5 + blue_xMax} ${705.5 + blue_yMin} ${2454.5 + blue_xMax} ${534.5 + blue_yMin} ${2394.5 + blue_xMax} ${443 + blue_yMin}
            C${2334.5 + blue_xMax} ${351.5 + blue_yMin} ${2243.5 + blue_xMax} ${218 + blue_yMin} ${2368.5 + blue_xMax} ${142 + blue_yMin}
            C${2518.5 + blue_xMax} ${59 + blue_yMin} ${2762 + blue_xMax} ${248 + blue_yMin} ${2618.5 + blue_xMax} ${390 + blue_yMin}
            C${2539 + blue_xMax} ${470.5 + blue_yMin} ${2364.5 + blue_xMax} ${466.72 + blue_yMin} ${2364.5 + blue_xMax} ${466.72 + blue_yMin}

            L${2186.5 + blue_xMid2b} ${466.5 + blue_yMid}
            C${1995.5 + blue_xMid2b} ${469 + blue_yMid} ${1946.5 + blue_xMid2b} ${445 + blue_yMid} ${1721 + blue_xMid2b} ${403 + blue_yMid}
            C${1553.5 + blue_xMid2b} ${366 + blue_yMid} ${1547 + blue_xMid2b} ${522.5 + blue_yMid} ${1697.5 + blue_xMid2b} ${550 + blue_yMid}
            C${1774 + blue_xMid2b} ${564.501 + blue_yMid} ${1797 + blue_xMid2b} ${564.501 + blue_yMid} ${1991 + blue_xMid2b} ${564.501 + blue_yMid}

            L${2031.5 + blue_xMax2a} ${564.501 + blue_yMid}
            C${2159.5 + blue_xMax2a} ${564.501 + blue_yMid} ${2215.88 + blue_xMax2a} ${642 + blue_yMid} ${2215.88 + blue_xMax2a} ${705.5 + blue_yMid}

            L${2216 + blue_xMax2a} ${722.5 + blue_yMax}
            C${2216 + blue_xMax2a} ${788 + blue_yMax} ${2162.5 + blue_xMax2a} ${854.5 + blue_yMax} ${2032.5 + blue_xMax2a} ${854.5 + blue_yMax}

            L${1999.5 + blue_xMid2a} ${853.501 + blue_yMax}
            C${1999.5 + blue_xMid2a} ${853.501 + blue_yMax} ${1725 + blue_xMid2a} ${845 + blue_yMax} ${1725 + blue_xMid2a} ${963 + blue_yMax}
            C${1725 + blue_xMid2a} ${1081 + blue_yMax} ${1886.08 + blue_xMid2a} ${1081 + blue_yMax} ${1885 + blue_xMid2a} ${963 + blue_yMax}
            C${1883.92 + blue_xMid2a} ${845 + blue_yMax} ${1636.5 + blue_xMid2a} ${853.501 + blue_yMax} ${1636.5 + blue_xMid2a} ${853.501 + blue_yMax}

            L${1426.5 + blue_xMin} ${853.501 + blue_yMax}
            C${1235.5 + blue_xMin} ${853.501 + blue_yMax} ${1255.5 + blue_xMin} ${1009 + blue_yMax} ${1255.5 + blue_xMin} ${1151 + blue_yMax}
            C${1255.5 + blue_xMin} ${1293 + blue_yMax} ${1096 + blue_xMin} ${1299 + blue_yMax} ${1096 + blue_xMin} ${1151 + blue_yMax}
            C${1096 + blue_xMin} ${1003 + blue_yMax} ${1096 + blue_xMin} ${1050.5 + blue_yMax} ${1096 + blue_xMin} ${926.501 + blue_yMax}
            C${1096 + blue_xMin} ${802.5 + blue_yMax} ${938.5 + blue_xMin} ${803.501 + blue_yMax} ${938.5 + blue_xMin} ${926.501 + blue_yMax}
            C${938.5 + blue_xMin} ${995.423 + blue_yMax} ${938.5 + blue_xMin} ${852.794 + blue_yMax} ${938.5 + blue_xMin} ${969.5 + blue_yMax}
            C${938.5 + blue_xMin} ${969.5 + blue_yMax} ${947 + blue_xMin} ${1163 + blue_yMax} ${800.5 + blue_xMin} ${1161 + blue_yMax}
            C${685.5 + blue_xMin} ${1161 + blue_yMax} ${683 + blue_xMin} ${1008.5 + blue_yMax} ${800.5 + blue_xMin} ${1009.5 + blue_yMax}
            C${944.5 + blue_xMin} ${1011 + blue_yMax} ${938.5 + blue_xMin} ${1181 + blue_yMax} ${938.5 + blue_xMin} ${1181 + blue_yMax}
            C${938.5 + blue_xMin} ${1244.26 + blue_yMax} ${938.5 + blue_xMin} ${1270.39 + blue_yMax} ${938.5 + blue_xMin} ${1283 + blue_yMax}
            C${938.5 + blue_xMin} ${1335.5 + blue_yMax} ${976 + blue_xMin} ${1377 + blue_yMax} ${1023.5 + blue_xMin} ${1377 + blue_yMax}
            C${1071 + blue_xMin} ${1377 + blue_yMax} ${1090.5 + blue_xMin} ${1377 + blue_yMax} ${1144.5 + blue_xMin} ${1377 + blue_yMax}
            C${1198.5 + blue_xMin} ${1377 + blue_yMax} ${1259.5 + blue_xMin} ${1389 + blue_yMax} ${1259.5 + blue_xMin} ${1440.5 + blue_yMax}
            C${1259.5 + blue_xMin} ${1492 + blue_yMax} ${1199.5 + blue_xMin} ${1511 + blue_yMax} ${1144.5 + blue_xMin} ${1511 + blue_yMax}
            H${884.5 + blue_xMin}

          `;

          const yellow_xMin = 20
          const yellow_xMin2a = 10 + svgWidth / 5
          const yellow_xMid = svgWidth / 2
          const yellow_xMid2a = svgWidth / 2 - svgWidth / 5
          const yellow_xMid2b = svgWidth / 2 + (boundsWidth * 0.04)
          const yellow_xMax = svgWidth + 50
          const yellow_yMin = -20
          const yellow_yMid = svgHeight / 2
          const yellow_yMid2a = svgHeight / 2 + 100
          const yellow_yMax = svgHeight + 20
          const yellow_yMax2a = svgHeight + 5

          const pathYellow = `

            M${1378.5 + yellow_xMid} ${379 + yellow_yMin}
            L${1178.5 + yellow_xMid2a} ${379 + yellow_yMin}
            C${1178.5 + yellow_xMid2a} ${379 + yellow_yMin} ${993.5 + yellow_xMid2a} ${379 + yellow_yMin} ${934.5 + yellow_xMid2a} ${379 + yellow_yMin}
            C${875.5 + yellow_xMid2a} ${379 + yellow_yMin} ${705.5 + yellow_xMid2a} ${354.5 + yellow_yMin} ${705.5 + yellow_xMid2a} ${206 + yellow_yMin}
            C${705.5 + yellow_xMid2a} ${46 + yellow_yMin} ${941.5 + yellow_xMid2a} ${54 + yellow_yMin} ${941 + yellow_xMid2a} ${206 + yellow_yMin}
            C${940.551 + yellow_xMid2a} ${342.5 + yellow_yMin} ${782.5 + yellow_xMid2a} ${479 + yellow_yMin} ${624.5 + yellow_xMid2a} ${479 + yellow_yMin}
            C${555.5 + yellow_xMid2a} ${479 + yellow_yMin} ${555.5 + yellow_xMid2a} ${479 + yellow_yMin} ${555.5 + yellow_xMid2a} ${479 + yellow_yMin}

            L${476.5 + yellow_xMin} ${479.001 + yellow_yMin}
            C${363 + yellow_xMin} ${479.001 + yellow_yMin} ${346 + yellow_xMin} ${336.001 + yellow_yMin} ${484 + yellow_xMin} ${336.001 + yellow_yMin}
            C${621.999 + yellow_xMin} ${336.001 + yellow_yMin} ${614.5 + yellow_xMin} ${232.001 + yellow_yMin} ${614.5 + yellow_xMin} ${128.001 + yellow_yMin}
            C${614.5 + yellow_xMin} ${24.0011 + yellow_yMin} ${473.5 + yellow_xMin} ${26.0011 + yellow_yMin} ${476.5 + yellow_xMin} ${128.001 + yellow_yMin}
            C${476.5 + yellow_xMin} ${128.001 + yellow_yMin} ${476.5 + yellow_xMin} ${122.001 + yellow_yMin} ${476.5 + yellow_xMin} ${163.501 + yellow_yMin}
            C${476.5 + yellow_xMin} ${207.614 + yellow_yMin} ${497 + yellow_xMin} ${244.501 + yellow_yMin} ${553 + yellow_xMin} ${244.501 + yellow_yMin}
            C${656.5 + yellow_xMin} ${244.501 + yellow_yMin} ${701.236 + yellow_xMin} ${359.166 + yellow_yMin} ${701.236 + yellow_xMin} ${424 + yellow_yMin}
            C${701.236 + yellow_xMin} ${801 + yellow_yMin} ${5.99963 + yellow_xMin} ${801 + yellow_yMin} ${5.99963 + yellow_xMin} ${424 + yellow_yMin}
            C${5.99965 + yellow_xMin} ${185 + yellow_yMin} ${226.5 + yellow_xMin} ${244.501 + yellow_yMin} ${226.5 + yellow_xMin} ${128.001 + yellow_yMin}
            C${226.5 + yellow_xMin} ${11.5012 + yellow_yMin} ${79.4996 + yellow_xMin} ${5.60959 + yellow_yMin} ${79.4996 + yellow_xMin} ${128.001 + yellow_yMin}
            C${79.4996 + yellow_xMin} ${250.393 + yellow_yMin} ${314 + yellow_xMin} ${206.001 + yellow_yMin} ${314 + yellow_xMin} ${407.001 + yellow_yMin}
            C${314 + yellow_xMin} ${577.389 + yellow_yMin} ${33.0001 + yellow_xMin} ${577.501 + yellow_yMin} ${33.0001 + yellow_xMin} ${784.001 + yellow_yMin}

            L${32.5 + yellow_xMin} ${1113.5 + yellow_yMax}
            C${33.5 + yellow_xMin} ${1232.5 + yellow_yMax} ${71 + yellow_xMin} ${1289 + yellow_yMax} ${196 + yellow_xMin} ${1289 + yellow_yMax}

            L${315.5 + yellow_xMin2a} ${1287.5 + yellow_yMax}
            C${410.5 + yellow_xMin2a} ${1287.5 + yellow_yMax} ${451.236 + yellow_xMin2a} ${1253 + yellow_yMax} ${451.236 + yellow_xMin2a} ${1205 + yellow_yMax}
            C${451.236 + yellow_xMin2a} ${1138 + yellow_yMax} ${451.236 + yellow_xMin2a} ${1042.7 + yellow_yMax} ${451.236 + yellow_xMin2a} ${940.001 + yellow_yMax}
            C${451.236 + yellow_xMin2a} ${843.501 + yellow_yMax} ${596.235 + yellow_xMin2a} ${844.001 + yellow_yMax} ${596.235 + yellow_xMin2a} ${940.001 + yellow_yMax}
            C${596.235 + yellow_xMin2a} ${1032.7 + yellow_yMax} ${555.5 + yellow_xMin2a} ${1028 + yellow_yMax} ${451.236 + yellow_xMin2a} ${1028 + yellow_yMax}

            L${334 + yellow_xMin} ${1028.5 + yellow_yMax}
            C${243 + yellow_xMin} ${1028.5 + yellow_yMax} ${246 + yellow_xMin} ${1154 + yellow_yMax} ${335 + yellow_xMin} ${1154 + yellow_yMax}

            L${509.5 + yellow_xMid2a} ${1153 + yellow_yMax}
            H${579 + yellow_xMid2a}
            C${638 + yellow_xMid2a} ${1153 + yellow_yMax} ${656 + yellow_xMid2a} ${1182 + yellow_yMax} ${656 + yellow_xMid2a} ${1235.5 + yellow_yMax}
            V${1312.5 + yellow_yMax}
            C${656 + yellow_xMid2a} ${1391.5 + yellow_yMax} ${770.5 + yellow_xMid2a} ${1391.5 + yellow_yMax} ${770.5 + yellow_xMid2a} ${1312.5 + yellow_yMax}
            C${770.5 + yellow_xMid2a} ${1233.5 + yellow_yMax} ${770.5 + yellow_xMid2a} ${1014 + yellow_yMax} ${770.5 + yellow_xMid2a} ${918 + yellow_yMax}
            C${770.5 + yellow_xMid2a} ${822 + yellow_yMax} ${892 + yellow_xMid2a} ${822 + yellow_yMax} ${892 + yellow_xMid2a} ${918 + yellow_yMax}
            C${892 + yellow_xMid2a} ${1014 + yellow_yMax} ${892 + yellow_xMid2a} ${1070.5 + yellow_yMax} ${892 + yellow_xMid2a} ${1070.5 + yellow_yMax}
            C${892 + yellow_xMid2a} ${1153 + yellow_yMax} ${964.5 + yellow_xMid2a} ${1153 + yellow_yMax} ${964.5 + yellow_xMid2a} ${1153 + yellow_yMax}

            L${1024 + yellow_xMid2b} ${1153 + yellow_yMax}
            C${1190.5 + yellow_xMid2b} ${1153 + yellow_yMax} ${1171.5 + yellow_xMid2b} ${1083 + yellow_yMax} ${1171.5 + yellow_xMid2b} ${912.501 + yellow_yMax}
            C${1171.5 + yellow_xMid2b} ${807.001 + yellow_yMax} ${1303.5 + yellow_xMid2b} ${813.001 + yellow_yMax} ${1303.5 + yellow_xMid2b} ${912.501 + yellow_yMax}
            C${1303.5 + yellow_xMid2b} ${976.001 + yellow_yMax} ${1334 + yellow_xMid2b} ${976.001 + yellow_yMax} ${1466 + yellow_xMid2b} ${976.001 + yellow_yMax}
            C${1466 + yellow_xMid2b} ${976.001 + yellow_yMax} ${1576.13 + yellow_xMid2b} ${976.001 + yellow_yMax} ${1791.5 + yellow_xMid2b} ${976.001 + yellow_yMax}
            C${1918 + yellow_xMid2b} ${976.001 + yellow_yMax} ${1920.5 + yellow_xMid2b} ${1153 + yellow_yMax} ${1791.5 + yellow_xMid2b} ${1153 + yellow_yMax}
            H${1485 + yellow_xMid2b}
            C${1387 + yellow_xMid2b} ${1153 + yellow_yMax} ${1312 + yellow_xMid2b} ${1153 + yellow_yMax} ${1312 + yellow_xMid2b} ${1275 + yellow_yMax}

            L${1312 + yellow_xMid2b} ${1422.5 + yellow_yMax2a}
            C${1312 + yellow_xMid2b} ${1493 + yellow_yMax2a} ${1354 + yellow_xMid2b} ${1507 + yellow_yMax2a} ${1415.5 + yellow_xMid2b} ${1507 + yellow_yMax2a}
            H${1815.5 + yellow_xMid2b}

          `;

          const red_xMin = 20
          const red_xMid = svgWidth / 2
          const red_xMid2a = svgWidth / 5
          const red_xMid2b = svgWidth / 5 + (boundsWidth * 0.03)
          const red_xMax = svgWidth + 50
          const red_yMin = 0
          const red_yMid = svgHeight / 2
          const red_yMax = svgHeight + 50
          const red_yMax2a = svgHeight + 12

          const pathRed = `

              M${1113.5 + red_xMid} ${242.002 + red_yMin}
              C${1113.5 + red_xMid} ${242.002 + red_yMin} ${889.997 + red_xMid} ${242.002 + red_yMin} ${841.499 + red_xMid} ${242.002 + red_yMin}
              C${793 + red_xMid} ${242.002 + red_yMin} ${752.999 + red_xMid} ${206 + red_yMin} ${752.999 + red_xMid} ${170.002 + red_yMin}
              C${752.999 + red_xMid} ${134.003 + red_yMin} ${752.999 + red_xMid} ${130.421 + red_yMin} ${752.999 + red_xMid} ${86.0016 + red_yMin}
              C${752.999 + red_xMid} ${-21.4984 + red_yMin} ${912.5 + red_xMid} ${-17.9984 + red_yMin} ${912.5 + red_xMid} ${86.0016 + red_yMin}
              C${912.5 + red_xMid} ${154.345 + red_yMin} ${884.999 + red_xMid} ${173.002 + red_yMin} ${821.499 + red_xMid} ${171.502 + red_yMin}
              L${616.5 + red_xMid} ${168.502 + red_yMin}
              C${616.5 + red_xMid} ${168.502 + red_yMin} ${544.5 + red_xMid} ${176.998 + red_yMin} ${544.5 + red_xMid} ${243.5 + red_yMin}
              C${544.5 + red_xMid} ${310.002 + red_yMin} ${616.5 + red_xMid} ${320.002 + red_yMin} ${616.5 + red_xMid} ${320.002 + red_yMin}
              H${920.498 + red_xMid}
              C${1101.5 + red_xMid} ${320.002 + red_yMin} ${1103 + red_xMid} ${517.502 + red_yMin} ${920.498 + red_xMid} ${517.502 + red_yMin}
              H${905 + red_xMid}

              L${864 + red_xMid2a} ${517.563 + red_yMin}
              C${786.5 + red_xMid2a} ${517.563 + red_yMin} ${689 + red_xMid2a} ${517.563 + red_yMin} ${689 + red_xMid2a} ${446.475 + red_yMin}
              C${689 + red_xMid2a} ${382 + red_yMin} ${792.5 + red_xMid2a} ${382.5 + red_yMin} ${792.5 + red_xMid2a} ${446.475 + red_yMin}
              C${792.5 + red_xMid2a} ${517.563 + red_yMin} ${696.5 + red_xMid2a} ${517.563 + red_yMin} ${612 + red_xMid2a} ${517.563 + red_yMin}

              L${555 + red_xMin} ${518.501 + red_yMin}
              C${427.5 + red_xMin} ${518.501 + red_yMin} ${439.999 + red_xMin} ${639.501 + red_yMin} ${559.999 + red_xMin} ${639.501 + red_yMin}
              C${680 + red_xMin} ${639.501 + red_yMin} ${680 + red_xMin} ${752.001 + red_yMin} ${555 + red_xMin} ${752.001 + red_yMin}
              C${347 + red_xMin} ${752.001 + red_yMin} ${434.5 + red_xMin} ${639.5 + red_yMin} ${303 + red_xMin} ${639.5 + red_yMin}
              C${171.5 + red_xMin} ${639.5 + red_yMin} ${85.9995 + red_xMin} ${551 + red_yMin} ${85.9995 + red_xMin} ${476 + red_yMin}
              C${85.9995 + red_xMin} ${401 + red_yMin} ${85.9995 + red_xMin} ${434.001 + red_yMin} ${85.9995 + red_xMin} ${434.001 + red_yMin}
              C${85.9995 + red_xMin} ${283.001 + red_yMin} ${230 + red_xMin} ${285.001 + red_yMin} ${230 + red_xMin} ${434.001 + red_yMin}
              C${230 + red_xMin} ${498 + red_yMin} ${230 + red_xMin} ${477.878 + red_yMin} ${230 + red_xMin} ${476 + red_yMin}
              C${230 + red_xMin} ${508.615 + red_yMin} ${200.969 + red_xMin} ${622.059 + red_yMin} ${203.384 + red_xMin} ${717 + red_yMin}

              L${203.384 + red_xMin} ${716 + red_yMax}
              C${210.5 + red_xMin} ${850 + red_yMax} ${238 + red_xMin} ${851 + red_yMax} ${377 + red_xMin} ${870 + red_yMax}
              C${516 + red_xMin} ${889 + red_yMax} ${549 + red_xMin} ${1107 + red_yMax} ${645.5 + red_xMin} ${1120 + red_yMax}
              C${742 + red_xMin} ${1133 + red_yMax} ${813 + red_xMin} ${1067 + red_yMax} ${920 + red_xMin} ${1069 + red_yMax}

              L${961.5 + red_xMid2b} ${1071 + red_yMax}
              C${961.5 + red_xMid2b} ${1071 + red_yMax} ${1199.5 + red_xMid2b} ${1071 + red_yMax} ${1199.5 + red_xMid2b} ${1200 + red_yMax}
              C${1199.5 + red_xMid2b} ${1310 + red_yMax} ${1032 + red_xMid2b} ${1306 + red_yMax} ${1032 + red_xMid2b} ${1200 + red_yMax}
              C${1030.11 + red_xMid2b} ${1064.42 + red_yMax} ${1263.5 + red_xMid2b} ${1071 + red_yMax} ${1263.5 + red_xMid2b} ${1071 + red_yMax}

              L${1280.5 + red_xMid} ${1069.5 + red_yMax}
              C${1461.51 + red_xMid} ${1069.5 + red_yMax} ${1215.5 + red_xMid} ${1069.5 + red_yMax} ${1421.5 + red_xMid} ${1069.5 + red_yMax}
              C${1571.89 + red_xMid} ${1069.5 + red_yMax} ${1675.5 + red_xMid} ${1042 + red_yMax} ${1675.5 + red_xMid} ${972.501 + red_yMax}
              C${1675.5 + red_xMid} ${903.001 + red_yMax} ${1564.5 + red_xMid} ${896.501 + red_yMax} ${1564.5 + red_xMid} ${972.501 + red_yMax}
              C${1564.5 + red_xMid} ${1048.5 + red_yMax} ${1645 + red_xMid} ${1069.5 + red_yMax} ${1925 + red_xMid} ${1069.5 + red_yMax}

              L${2192.5 + red_xMax} ${1070.5 + red_yMax}
              C${2350.5 + red_xMax} ${1070.5 + red_yMax} ${2332 + red_xMax} ${938.526 + red_yMax} ${2451.5 + red_xMax} ${937.264 + red_yMax}
              C${2571 + red_xMax} ${936.001 + red_yMax} ${2593.5 + red_xMax} ${1035.5 + red_yMax} ${2593.5 + red_xMax} ${1094 + red_yMax}
              V${1159.5 + red_yMax}
              C${2593.5 + red_xMax} ${1236 + red_yMax} ${2544.5 + red_xMax} ${1319.5 + red_yMax} ${2359 + red_xMax} ${1319.5 + red_yMax}
              C${2173.5 + red_xMax} ${1319.5 + red_yMax} ${2173.5 + red_xMax} ${1151 + red_yMax} ${2359 + red_xMax} ${1151 + red_yMax}
              C${2544.5 + red_xMax} ${1151 + red_yMax} ${2593.5 + red_xMax} ${1232.5 + red_yMax} ${2593.5 + red_xMax} ${1319.5 + red_yMax}

              V${1389 + red_yMax2a}
              C${2593.5 + red_xMax} ${1476 + red_yMax2a} ${2545.5 + red_xMax} ${1503 + red_yMax2a} ${2488.5 + red_xMax} ${1503 + red_yMax2a}
              H${2088.5 + red_xMax}
            `;

            // (<path d="|" stroke="#324BF7" stroke-width="12"/>)

            // (\d)(C|M|Q|C|S|T|A|L|H|V|Z)
            // $1\n$2

            // C(\d*\.?\d*)
            // C${$1 + red_xMin}

            // (\d)\s(-?\d+\.?\d*)
            // $1 ${$2 + red_xMin}

            // \}\s(-?\d*\.?\d*)
            // } ${$1 + red_yMax}

            // debugging
            const boundingBox = `
              M${strokeSize} ${strokeSize}
              L${canvasWidth} ${strokeSize}
              L${canvasWidth} ${canvasHeight}
              L${strokeSize} ${canvasHeight}
              L${strokeSize} ${strokeSize}
            `;

          return (
            <>
              <Matte bounds={bounds} ratio={ratio} showMatte={showMatte} />
              <Panel
                id={id} bounds={bounds}
                pathIds={[
                  // 'boundingBox',

                  // spaghettiContext.routes['pourquoi-ce-site'].status !== 'read' && 'pathGreen',
                  // spaghettiContext.routes['dans-quel-but'].status !== 'read' && 'pathBlue',
                  // spaghettiContext.routes['qu-est-ce-que-c-est'].status !== 'read' && 'pathYellow',
                  // spaghettiContext.routes['comment-contribuer'].status !== 'read' && 'pathRed',

                  spaghettiContext.routes['pourquoi-ce-site'].status !== 'read' && 'pathGreen',

                  (spaghettiContext.routes['pourquoi-ce-site'].status === 'read' &&
                    spaghettiContext.routes['dans-quel-but'].status !== 'read') && 'pathBlue',

                  (spaghettiContext.routes['pourquoi-ce-site'].status === 'read' &&
                    spaghettiContext.routes['dans-quel-but'].status === 'read' &&
                    spaghettiContext.routes['qu-est-ce-que-c-est'].status !== 'read') && 'pathYellow',

                  (spaghettiContext.routes['pourquoi-ce-site'].status === 'read' &&
                    spaghettiContext.routes['dans-quel-but'].status === 'read' &&
                    spaghettiContext.routes['qu-est-ce-que-c-est'].status === 'read' &&
                    spaghettiContext.routes['comment-contribuer'].status !== 'read') && 'pathRed',
                ]}
                paths={{
                  boundingBox: {
                    path: boundingBox, color: '#F2563D',
                  },
                  pathGreen: {
                    path: pathGreen, color: '#39A256', duration: 10,
                  },
                  pathBlue: {
                    path: pathBlue, color: '#324BF7', duration: 10,
                  },
                  pathYellow: {
                    path: pathYellow, color: '#FFFF00', duration: 10,
                  },
                  pathRed: {
                    path: pathRed, color: '#FF0000', duration: 10,
                  },
                }}
                preserveAspectRatio={_preserveAspectRatio}
                strokeSize={strokeSize} scale={scale}
                viewbox={{ width: viewBoxWidth, height: viewBoxHeight }}
                offset={{ x: translateX, y: translateY }}
                ratio={ratio}
                showMatte={showMatte}
                mode='desk'
              />
            </>
          )
        }}
      </MeasureAndRender>
    </div>
  )
}

export default observer(LinePaths)
