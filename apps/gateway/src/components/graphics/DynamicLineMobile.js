'use client'

import React from 'react'
import { observer } from 'mobx-react-lite'
import MeasureAndRender from '@src/components/graphics/MeasureAndRender'
import { getStores } from '@flexiness/domain-store'
const stores = getStores()

import Panel from '@src/components/graphics/Panel'
import Matte from '@src/components/graphics/matteMob'

const LinePaths = ({id, viewBoxWidth, viewBoxHeight, preserveAspectRatio}) => {
  const { spaghettiContext } = stores.SpaghettiStore

  const strokeSize = 4;
  const boundsXOffset = 0;
  // const boundsXOffset = 0;
  const boundsYOffset = 0;
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
          if (bounds.width > (1023 - boundsXOffset)) return null;

          const boundsWidth = bounds.width;
          const boundsHeight = bounds.height;
          const ratio = 2;
          const scale = 0.5
          const canvasWidth = (boundsWidth * ratio) - strokeSize
          const canvasHeight = (boundsHeight * ratio) - strokeSize
          const svgWidth = canvasWidth - viewBoxWidth
          const svgHeight = canvasHeight - viewBoxHeight

          const green_xMin = 10
          const green_xMin0a = (boundsWidth * 0.25) - 50
          const green_xMin0b = green_xMin0a - (boundsWidth * 0.075) - 30
          const green_xMin0b2 = green_xMin0a - (boundsWidth * 0.075)
          const green_xMin0c = green_xMin0a + (svgWidth / 2 * 0.45) - 80
          const green_xMin0c2 = green_xMin0a + (svgWidth / 2 * 0.45) - 100
          const green_xMin0d = green_xMin0a + (svgWidth / 2 * 0.01) - 80
          const green_xMin0d2 = green_xMin0a + (svgWidth / 2 * 0.025) - 100
          // const green_xMin0e = green_xMin0a + (svgWidth / 2 * 0.125)
          const green_xMin0e = (svgWidth / 8)
          const green_xMin0e1a = green_xMin0e + 30
          const green_xMin0e1b = (svgWidth / 4) - 90
          const green_xMin0f = (svgWidth / 2)



          const green_xMid = svgWidth / 2
          const green_xMid0a = svgWidth / 2 + (boundsWidth * 0.1)
          const green_xMid0b = svgWidth / 2 + (boundsWidth * 0.05)
          // const green_xMid0c = svgWidth / 2 + (boundsWidth * 0.15)
          const green_xMid0c = svgWidth - (boundsWidth * 0.25)
          // const green_xMid0d = svgWidth / 2 + (boundsWidth * 0.1)
          const green_xMid0d = svgWidth - (boundsWidth * 0.3)
          const green_xMid0e = svgWidth - (boundsWidth * 0.4)
          const green_xMid0f = green_xMid0e - 60
          const green_xMid0g = green_xMid0f - (svgWidth / 2 * 0.1)
          const green_xMid0h = green_xMid0g - (svgWidth / 2 * 0.1)
          const green_xMid0i = green_xMid0h - (svgWidth / 2 * 0.1)
          // const green_xMid1a = green_xMin + (boundsWidth * 0.05) - 5
          const green_xMid1b = svgWidth / 2 + (boundsWidth * 0.05)
          const green_xMid1c = svgWidth / 2 - (boundsWidth * 0.2)
          const green_xMid1d = green_xMid1b - 50
          const green_xMid1e = svgWidth / 2 - (boundsWidth * 0.275)

          const green_xMid2e = svgWidth / 2 + (boundsWidth * 0.0002)
          const green_xMid2e2 = svgWidth / 2 - (boundsWidth * 0.3) - 50
          const green_xMid2e3 = svgWidth / 2 - (boundsWidth * 0.1)

          const green_xMid3a = green_xMid + (boundsWidth * 0.25)
          const green_xMid3b = green_xMid3a - 30
          const green_xMid3c = green_xMid3a + (boundsWidth * 0.15)

          const green_xMid4a = (svgWidth / 3) + 40

          const green_xMax = svgWidth - 30 - (boundsWidth * 0.01)
          const green_xMax1a = green_xMax - (boundsWidth * 0.03)
          // const green_xMax1b = green_xMax - (boundsWidth * 0.05)
          // const green_xMax2a = green_xMax - (boundsWidth * 0.01)
          const green_xMax3a = svgWidth - (svgWidth / 8)

          const green_yMin = (boundsHeight * 0.03)
          // const green_yMin1a = svgHeight / 2 - (boundsHeight * 0.18)
          const green_yMin1a = svgHeight / 9 - (boundsHeight * 0.08)
          // const green_yMin1a = svgHeight / 2 - svgHeight / 3.5
          const green_yMin1b = svgHeight / 2 - (boundsHeight * 0.18)
          const green_yMid = svgHeight / 2
          const green_yMid1a = svgHeight / 2 - (boundsHeight * 0.12)
          const green_yMid1b = svgHeight / 2 + (boundsHeight * 0.12)
          const green_yMid1b2 = svgHeight / 2 + (boundsHeight * 0.1)
          const green_yMid1d = svgHeight / 2 + (boundsHeight * 0.16)
          const green_yMid1d2 = svgHeight / 2 + (boundsHeight * 0.16) - 100
          const green_yMid1d3 = svgHeight / 2 + (boundsHeight * 0.16) - 100
          const green_yMid1e = svgHeight / 2 + (boundsHeight * 0.28)
          const green_yMid2a = svgHeight / 2 - (boundsHeight * 0.21)
          const green_yMid2b = svgHeight / 2 - (boundsHeight * 0.26)
          const green_yMid2c = svgHeight / 2 + (boundsHeight * 0.003) - svgHeight / 12
          const green_yMax = svgHeight - 80
          const green_yMax1a = green_yMax - (boundsHeight * 0.18)
          const green_yMax1b = green_yMax1a - 80
          const green_yMax2a = green_yMax1a - 10

          // (^(<path d=")|(" stroke="#8558D2" stroke-width="6"/>)$)

          // (\d)(C|L|M|Q|C|S|T|A|L|H|V|Z)
          // $1\n$2

          // ^(C|M|H|L|V)(-?\d*\.?\d*)
          // $1${$2 + red_xMin}

          // (\d)\s(-?\d+\.?\d*)
          // $1 ${$2 + red_xMin}

          // \}\s(-?\d*\.?\d*)
          // } ${$1 + red_yMax}

          const pathGreen = `

            M${340.5 + green_xMid0a} ${158 + green_yMin}
            C${440.5 + green_xMid0a} ${158 + green_yMin} ${541.5 + green_xMid0a} ${155.627 + green_yMin} ${541 + green_xMid0a} ${101 + green_yMin}
            C${540.5 + green_xMid0a} ${46.3731 + green_yMin} ${467 + green_xMid0a} ${43.9999 + green_yMin} ${468 + green_xMid0a} ${101 + green_yMin}
            C${469 + green_xMid0a} ${158 + green_yMin} ${558.5 + green_xMid0a} ${158 + green_yMin} ${558.5 + green_xMid0a} ${158 + green_yMin}

            L${581 + green_xMax} ${158 + green_yMin}
            C${631 + green_xMax} ${158 + green_yMin} ${631 + green_xMax} ${120 + green_yMin} ${631 + green_xMax} ${120 + green_yMin}

            L${631 + green_xMax} ${109 + green_yMin}
            V${100 + green_yMin}
            C${631 + green_xMax} ${88.5 + green_yMin} ${631 + green_xMax} ${47 + green_yMin} ${591 + green_xMax} ${47 + green_yMin}
            C${551 + green_xMax} ${47 + green_yMin} ${551.002 + green_xMax} ${98.5 + green_yMin} ${591 + green_xMax} ${98.5 + green_yMin}
            C${630.997 + green_xMax} ${98.5 + green_yMin} ${631 + green_xMax} ${66 + green_yMin} ${631 + green_xMax} ${47 + green_yMin}
            C${631 + green_xMax} ${28 + green_yMin} ${621 + green_xMax} ${17 + green_yMin} ${614.5 + green_xMax} ${12.5 + green_yMin}
            C${608 + green_xMax} ${8 + green_yMin} ${599.5 + green_xMax} ${3 + green_yMin} ${556.5 + green_xMax} ${3 + green_yMin}

            L${500 + green_xMax3a} ${3 + green_yMin}
            C${300 + green_xMax3a} ${3 + green_yMin}
              ${300 + green_xMax3a} ${65 + green_yMid1a}
              ${500 + green_xMax3a} ${65 + green_yMid1a}

            L${548.5 + green_xMax} ${65 + green_yMid1a}
            C${594.5 + green_xMax} ${65 + green_yMid1a} ${627 + green_xMax} ${69 + green_yMid1a} ${627 + green_xMax} ${120.5 + green_yMid1a}
            C${627 + green_xMax} ${160.5 + green_yMid1a} ${599.5 + green_xMax} ${178.5 + green_yMid1a} ${599 + green_xMax} ${225 + green_yMid1a}
            C${598.5 + green_xMax} ${271.5 + green_yMid1a} ${608.5 + green_xMax} ${301 + green_yMid1a} ${583 + green_xMax} ${301 + green_yMid1a}
            C${525 + green_xMax} ${300.5 + green_yMid1a} ${628.5 + green_xMax} ${151.585 + green_yMid1a} ${538.5 + green_xMax} ${122.5 + green_yMid1a}
            C${459.5 + green_xMax} ${96.9694 + green_yMid1a} ${421 + green_xMax} ${210.842 + green_yMid1a} ${504.5 + green_xMax} ${235.5 + green_yMid1a}
            C${560 + green_xMax} ${251.889 + green_yMid1a} ${591.5 + green_xMax} ${199 + green_yMid1a} ${627 + green_xMax} ${212 + green_yMid1a}
            C${671.5 + green_xMax} ${230 + green_yMid1a} ${612.369 + green_xMax} ${276.5 + green_yMid1a} ${627 + green_xMax} ${345 + green_yMid1a}
            C${638 + green_xMax} ${396.5 + green_yMid1a} ${592.5 + green_xMax} ${415 + green_yMid1a} ${510.5 + green_xMax} ${415 + green_yMid1a}

            L${413 + green_xMax1a} ${415 + green_yMid1a}
            C${300 + green_xMax1a} ${415 + green_yMid1a}
              ${300 + green_xMax1a} ${410 + green_yMid1b2}
              ${413 + green_xMax1a} ${410 + green_yMid1b2}

            L${413 + green_xMax1a} ${410 + green_yMid1b2}
            C${464.5 + green_xMax1a} ${410 + green_yMid1b2} ${464 + green_xMax1a} ${426.5 + green_yMid1b2} ${484.5 + green_xMax1a} ${410 + green_yMid1b2}
            C${505 + green_xMax1a} ${393.5 + green_yMid1b2} ${510 + green_xMax1a} ${410 + green_yMid1b2} ${557.5 + green_xMax1a} ${410 + green_yMid1b2}

            L${562 + green_xMax1a} ${410 + green_yMid1b2}
            C${597 + green_xMax1a} ${410 + green_yMid1b2} ${643 + green_xMax1a} ${382.5 + green_yMid1b2} ${643 + green_xMax1a} ${326.5 + green_yMid1b2}
            C${643 + green_xMax1a} ${270.5 + green_yMid1b2} ${586.5 + green_xMax1a} ${279 + green_yMid1b2} ${586.5 + green_xMax1a} ${326.5 + green_yMid1b2}
            C${586.5 + green_xMax1a} ${374 + green_yMid1b2} ${621 + green_xMax1a} ${397 + green_yMid1b2} ${621 + green_xMax1a} ${417 + green_yMid1b2}

            L${621 + green_xMax1a} ${424.5 + green_yMid1b}
            C${621 + green_xMax1a} ${447.5 + green_yMid1b} ${642.029 + green_xMax1a} ${436.5 + green_yMid1b} ${621 + green_xMax1a} ${464 + green_yMid1b}
            C${608 + green_xMax1a} ${481 + green_yMid1b} ${644 + green_xMax1a} ${475.5 + green_yMid1b} ${644 + green_xMax1a} ${506 + green_yMid1b}

            L${643.5 + green_xMax1a} ${515.5 + green_yMid1b}
            C${643.5 + green_xMax1a} ${528.5 + green_yMid1b} ${643.5 + green_xMax1a} ${592.5 + green_yMid1b} ${583 + green_xMax1a} ${592 + green_yMid1b}
            C${522.5 + green_xMax1a} ${591.5 + green_yMid1b} ${522.5 + green_xMax1a} ${508.5 + green_yMid1b} ${583 + green_xMax1a} ${508.5 + green_yMid1b}
            C${643.5 + green_xMax1a} ${508.5 + green_yMid1b} ${643.5 + green_xMax1a} ${572 + green_yMid1b} ${643.5 + green_xMax1a} ${587.5 + green_yMid1b}

            L${643.5 + green_xMax1a} ${591 + green_yMid1d}
            C${643.5 + green_xMax1a} ${620 + green_yMid1d} ${599 + green_xMax1a} ${611 + green_yMid1d} ${599.5 + green_xMax1a} ${639 + green_yMid1d}

            L${599.5 + green_xMax1a} ${642 + green_yMax}
            C${600 + green_xMax1a} ${664 + green_yMax} ${643.5 + green_xMax1a} ${666.5 + green_yMax} ${643.5 + green_xMax1a} ${642 + green_yMax}
            C${643.5 + green_xMax1a} ${609 + green_yMax} ${574.25 + green_xMax1a} ${615.5 + green_yMax} ${559.25 + green_xMax1a} ${573 + green_yMax}
            C${556.5 + green_xMax1a} ${565 + green_yMax} ${554 + green_xMax1a} ${532 + green_yMax} ${528 + green_xMax1a} ${532 + green_yMax}

            L${528 + green_xMax1a} ${532 + green_yMax}
            C${550 + green_xMid0d} ${532 + green_yMax}
              ${550 + green_xMid0c} ${532 + green_yMax}
              ${547 + green_xMid0d} ${530 + green_yMid1d}

            L${544.5 + green_xMid0d} ${522.5 + green_yMid1d}
            C${540 + green_xMid0d} ${506 + green_yMid1d} ${531 + green_xMid0d} ${501 + green_yMid1d} ${515 + green_xMid0d} ${501 + green_yMid1d}

            L${513.5 + green_xMid1b} ${501 + green_yMid1d}
            C${490 + green_xMid1b} ${501 + green_yMid1d} ${425.5 + green_xMid1b} ${499 + green_yMid1d} ${425.5 + green_xMid1b} ${539 + green_yMid1d}
            C${425.5 + green_xMid1b} ${579 + green_yMid1d} ${487 + green_xMid1b} ${574.5 + green_yMid1d} ${487.5 + green_xMid1b} ${542 + green_yMid1d}
            C${488 + green_xMid1b} ${509.5 + green_yMid1d} ${443.5 + green_xMid1b} ${495 + green_yMid1d} ${410 + green_xMid1b} ${495 + green_yMid1d}

            L${408 + green_xMid1c} ${495 + green_yMid1d}
            C${289.5 + green_xMid1c} ${495 + green_yMid1d}
              ${308 + green_xMid1c} ${594 + green_yMid1d}
              ${398.5 + green_xMid1c} ${594 + green_yMid1d}

            L${464 + green_xMid0e} ${594 + green_yMid1d}
            C${492.5 + green_xMid0e} ${594 + green_yMid1d} ${498.5 + green_xMid0e} ${625.001 + green_yMid1d} ${523 + green_xMid0e} ${600 + green_yMid1d}
            C${547.5 + green_xMid0e} ${575 + green_yMid1d} ${591 + green_xMid0e} ${612.5 + green_yMid1d} ${564 + green_xMid0e} ${639 + green_yMid1d}

            L${563 + green_xMid0f} ${640 + green_yMid1e}
            C${546.5 + green_xMid0f} ${656 + green_yMid1e} ${543.5 + green_xMid0f} ${660 + green_yMid1e} ${525.5 + green_xMid0f} ${660 + green_yMid1e}

            L${523 + green_xMid0g} ${660 + green_yMid1e}
            C${488.5 + green_xMid0g} ${660 + green_yMid1e} ${503 + green_xMid0g} ${587.5 + green_yMid1e} ${468 + green_xMid0g} ${587.5 + green_yMid1e}

            L${208 + green_xMid4a} ${587.5 + green_yMid1e}
            C${100 + green_xMid4a} ${587.5 + green_yMid1e}
              ${100 + green_xMid4a} ${457 + green_yMid1e}
              ${190 + green_xMid4a} ${457 + green_yMid1e}
            C${230 + green_xMid4a} ${457 + green_yMid1e}
              ${230 + green_xMid4a} ${407 + green_yMid1e}
              ${190 + green_xMid4a} ${407 + green_yMid1e}
            C${30 + green_xMid4a} ${407 + green_yMid1e}
              ${30 + green_xMid4a} ${567 + green_yMid2a}
              ${190 + green_xMid4a} ${567 + green_yMid2a}

            L${190 + green_xMid0a} ${567 + green_yMid2a}
            C${225 + green_xMid0a} ${567 + green_yMid2a} ${278 + green_xMid0a} ${582 + green_yMid2a} ${291.5 + green_xMid0a} ${581.5 + green_yMid2a}
            C${305 + green_xMid0a} ${581 + green_yMid2a} ${332.5 + green_xMid0a} ${581.5 + green_yMid2a} ${354.5 + green_xMid0a} ${563 + green_yMid2a}
            C${399.5 + green_xMid0a} ${520 + green_yMid2a} ${328.5 + green_xMid0a} ${464.5 + green_yMid2a} ${291 + green_xMid0a} ${507 + green_yMid2a}
            C${253.5 + green_xMid0a} ${549.5 + green_yMid2a} ${326 + green_xMid0a} ${609 + green_yMid2a} ${294 + green_xMid0a} ${620 + green_yMid2a}
            C${262 + green_xMid0a} ${631 + green_yMid2a} ${270 + green_xMid0a} ${516.5 + green_yMid2a} ${231.5 + green_xMid0a} ${516.5 + green_yMid2a}
            L${214 + green_xMid0a} ${516.5 + green_yMid2a}

            L${206.5 + green_xMid2e3} ${514.5 + green_yMid2a}
            C${188 + green_xMid2e3} ${514.5 + green_yMid2a} ${194 + green_xMid2e3} ${498.5 + green_yMid2a} ${178.5 + green_xMid2e3} ${498.5 + green_yMid2a}
            C${163 + green_xMid2e3} ${498.5 + green_yMid2a} ${165 + green_xMid2e3} ${533.5 + green_yMid2a} ${151.5 + green_xMid2e3} ${533.5 + green_yMid2a}
            C${138 + green_xMid2e3} ${533.5 + green_yMid2a} ${140.5 + green_xMid2e3} ${514.5 + green_yMid2a} ${121.5 + green_xMid2e3} ${514.5 + green_yMid2a}

            L${213 + green_xMid2e2} ${516.5 + green_yMid2a}
            C${195 + green_xMid2e2} ${516.5 + green_yMid2a} ${155.5 + green_xMid2e2} ${503 + green_yMid2a} ${155.5 + green_xMid2e2} ${470 + green_yMid2a}
            C${155.5 + green_xMid2e2} ${436.5 + green_yMid2a} ${206.5 + green_xMid2e2} ${438.5 + green_yMid2a} ${206.5 + green_xMid2e2} ${473 + green_yMid2a}
            C${206.5 + green_xMid2e2} ${507.5 + green_yMid2a} ${167.5 + green_xMid2e2} ${508.5 + green_yMid2a} ${149 + green_xMid2e2} ${507.5 + green_yMid2a}

            L${88 + green_xMin0b2} ${507.5 + green_yMid2a}
            C${-40 + green_xMin0b2} ${507.5 + green_yMid2a}
              ${-40 + green_xMin0b2} ${375 + green_yMid2b}
              ${88 + green_xMin0b2} ${375 + green_yMid2b}

            L${108.5 + green_xMin0c} ${375 + green_yMid2b}
            C${135 + green_xMin0c} ${375 + green_yMid2b} ${134.5 + green_xMin0c} ${339 + green_yMid2b} ${108.5 + green_xMin0c} ${339.5 + green_yMid2b}

            L${106 + green_xMin0c2} ${338.5 + green_yMid2b}
            C${96.5 + green_xMin0c2} ${338.5 + green_yMid2b} ${37 + green_xMin0c2} ${339 + green_yMid2b} ${36 + green_xMin0c2} ${294.5 + green_yMid2b}
            C${35 + green_xMin0c2} ${250 + green_yMid2b} ${96.5 + green_xMin0c2} ${250.5 + green_yMid2b} ${96.5 + green_xMin0c2} ${294.5 + green_yMid2b}
            C${96.5 + green_xMin0c2} ${338.5 + green_yMid2b} ${36 + green_xMin0c2} ${338.5 + green_yMid2b} ${28.5 + green_xMin0c2} ${338.5 + green_yMid2b}

            L${27 + green_xMin} ${338.5 + green_yMid2b}
            C${7 + green_xMin} ${338.5 + green_yMid2b} ${3 + green_xMin} ${354.5 + green_yMid2b} ${3 + green_xMin} ${366.5 + green_yMid2b}

            L${3 + green_xMin} ${375 + green_yMid1d2}
            C${3 + green_xMin} ${415 + green_yMid1d2} ${3 + green_xMin} ${496 + green_yMid1d2} ${77 + green_xMin} ${496 + green_yMid1d2}
            C${151 + green_xMin} ${495.5 + green_yMid1d2} ${151.5 + green_xMin} ${388 + green_yMid1d2} ${77 + green_xMin} ${388.5 + green_yMid1d2}
            C${2.5 + green_xMin} ${389 + green_yMid1d2} ${3 + green_xMin} ${460 + green_yMid1d2} ${3 + green_xMin} ${508.5 + green_yMid1d2}

            L${3 + green_xMin} ${528.5 + green_yMax1b}
            C${3.5 + green_xMin} ${559 + green_yMax1b} ${22 + green_xMin} ${558.5 + green_yMax1b} ${22 + green_xMin} ${598 + green_yMax1b}

            L${22 + green_xMin} ${602 + green_yMax1a}
            C${22 + green_xMin} ${621.5 + green_yMax1a} ${29 + green_xMin} ${631 + green_yMax1a} ${48 + green_xMin} ${631 + green_yMax1a}

            L${50.5 + green_xMin0d} ${631 + green_yMax1a}
            C${87.5 + green_xMin0d} ${631 + green_yMax1a} ${98.5 + green_xMin0d} ${624.5 + green_yMax1a} ${116.5 + green_xMin0d} ${582 + green_yMax1a}
            C${134 + green_xMin0d} ${539.5 + green_yMax1a} ${99.5 + green_xMin0d} ${517.5 + green_yMax1a} ${72.5 + green_xMin0d} ${562 + green_yMax1a}
            C${45.5 + green_xMin0d} ${606.5 + green_yMax1a} ${67 + green_xMin0d} ${657 + green_yMax1a} ${113.5 + green_xMin0d} ${657 + green_yMax1a}
            H${119.5 + green_xMin0d}

            L${122 + green_xMin0e1b} ${657 + green_yMax1a}
            C${141.5 + green_xMin0e1b} ${657 + green_yMax1a} ${156.5 + green_xMin0e1b} ${649 + green_yMax1a} ${156.5 + green_xMin0e1b} ${627.5 + green_yMax1a}

            L${156.5 + green_xMin0e1b} ${573 + green_yMid1d3}
            C${156.5 + green_xMin0e1b} ${556.5 + green_yMid1d3} ${164 + green_xMin0e1b} ${545 + green_yMid1d3} ${181.5 + green_xMin0e1b} ${545 + green_yMid1d3}

            L${183.5 + green_xMin0e1b} ${545 + green_yMid1d3}
            C${203.5 + green_xMin0e1b} ${545 + green_yMid1d3} ${209 + green_xMin0e1b} ${559.5 + green_yMid1d3} ${209 + green_xMin0e1b} ${572.5 + green_yMid1d3}

            L${209 + green_xMin0e1b} ${580 + green_yMid1d3}
            C${209.5 + green_xMin0e1b} ${606.5 + green_yMid1d3} ${193 + green_xMin0e1b} ${676.5 + green_yMid1d3} ${233 + green_xMin0e1b} ${648.5 + green_yMid1d3}
            C${273 + green_xMin0e1b} ${620.5 + green_yMid1d3} ${256 + green_xMin0e1b} ${691 + green_yMid1d3} ${256 + green_xMin0e1b} ${718.5 + green_yMid1d3}
            v${-120 + green_yMid1d3}

          `;

          const blue_xMin0 = 5
          const blue_xMin = 20
          const blue_xMin0a = blue_xMin + (boundsWidth * 0.02) - 20
          const blue_xMin1b = blue_xMin - (boundsWidth * 0.08)
          const blue_xMin1c = blue_xMin - (boundsWidth * 0.05)

          const blue_xMid = svgWidth / 2 + svgWidth / 16
          const blue_xMid0a = svgWidth / 2 + svgWidth / 4
          const blue_xMid0b = svgWidth / 2 + svgWidth / 6
          const blue_xMid1a = svgWidth / 2 + svgWidth / 5 + (boundsWidth * 0.12)
          const blue_xMid1b = svgWidth / 2 + (boundsWidth * 0.15)
          const blue_xMid1c = svgWidth / 2 + svgWidth / 5 + (boundsWidth * 0.04)
          const blue_xMid1d = svgWidth / 2 - svgWidth / 8
          const blue_xMid1e = svgWidth / 2 - svgWidth / 4 - (boundsWidth * 0.01)
          const blue_xMid1f = svgWidth / 2 - svgWidth / 3 - (boundsWidth * 0.09)
          const blue_xMid1g = svgWidth / 2 - svgWidth / 3 - (boundsWidth * 0.12)
          const blue_xMid1h = svgWidth / 2 + svgWidth / 16 - (boundsWidth * 0.12)
          const blue_xMid1i = svgWidth / 2 + svgWidth / 16 + (boundsWidth * 0.02)
          const blue_xMid2a = svgWidth / 2 - svgWidth / 7 - (boundsWidth * 0.09)
          const blue_xMid2b = svgWidth / 2 + svgWidth / 10 + 50

          const blue_xMax = svgWidth - (boundsWidth * 0.1)
          const blue_xMax0 = svgWidth - 25
          const blue_xMax1a = (svgWidth / 4 * 3) + 30

          const blue_yMin = 22
          const blue_yMin1a = blue_yMin + (boundsHeight * 0.08)
          const blue_yMin1b = blue_yMin - (boundsHeight * 0.013)
          const blue_yMin1c = blue_yMin - (boundsHeight * 0.015)
          const blue_yMin1d = blue_yMin + (boundsHeight * 0.2)

          const blue_yMid = svgHeight / 2 - 98
          const blue_yMid1a = blue_yMid - (boundsHeight * 0.15)
          const blue_yMid1b = svgHeight / 2 - (boundsHeight * 0.16)
          const blue_yMid1c = svgHeight / 2 - (boundsHeight * 0.1)
          const blue_yMid1d = svgHeight / 2 - (boundsHeight * 0.06)
          const blue_yMid1e = svgHeight / 2 - (boundsHeight * 0.14)
          const blue_yMid2a = svgHeight / 2 - 98

          const blue_yMax = svgHeight
          const blue_yMax1b = svgHeight - (boundsHeight * 0.4)
          const blue_yMax1c = svgHeight - (boundsHeight * 0.7)
          const blue_yMax1d = svgHeight - (boundsHeight * 0.4)
          const blue_yMax1e = svgHeight - (boundsHeight * 0.35)
          const blue_yMax2e = svgHeight - (boundsHeight * 0.3)
          const blue_yMax1f = svgHeight - (boundsHeight * 0.2)
          const blue_yMax1g = svgHeight - (boundsHeight * 0.25)
          const blue_yMax2a = svgHeight + 12

          const pathBlue = `

            M${80 + blue_xMid0a} ${229 + blue_yMin}

            L${326.5 + blue_xMid0a} ${229 + blue_yMin}
            C${342.5 + blue_xMid0a} ${229 + blue_yMin} ${437.5 + blue_xMid0a} ${229.5 + blue_yMin} ${438.5 + blue_xMid0a} ${298.5 + blue_yMin}
            C${439.5 + blue_xMid0a} ${367.5 + blue_yMin} ${342.5 + blue_xMid0a} ${367.5 + blue_yMin} ${342.5 + blue_xMid0a} ${298.5 + blue_yMin}
            C${342.5 + blue_xMid0a} ${229.5 + blue_yMin} ${431.5 + blue_xMid0a} ${229 + blue_yMin} ${446.5 + blue_xMid0a} ${229 + blue_yMin}

            L${457 + blue_xMax} ${229 + blue_yMin}
            C${485.5 + blue_xMax} ${229 + blue_yMin} ${485 + blue_xMax} ${204 + blue_yMin} ${485 + blue_xMax} ${204 + blue_yMin}

            L${485 + blue_xMax} ${65 + blue_yMin}
            C${485 + blue_xMax} ${41 + blue_yMin} ${503.5 + blue_xMax} ${41 + blue_yMin} ${503.5 + blue_xMax} ${41 + blue_yMin}

            L${508.5 + blue_xMax} ${41 + blue_yMin}
            C${528 + blue_xMax} ${41 + blue_yMin} ${528 + blue_xMax} ${65 + blue_yMin} ${528 + blue_xMax} ${65 + blue_yMin}

            L${528.5 + blue_xMax} ${129.5 + blue_yMin}
            C${528.5 + blue_xMax} ${164.5 + blue_yMin} ${528.5 + blue_xMax} ${252 + blue_yMin} ${594 + blue_xMax} ${253 + blue_yMin}
            C${659.5 + blue_xMax} ${254 + blue_yMin} ${659.5 + blue_xMax} ${153.5 + blue_yMin} ${594 + blue_xMax} ${153.5 + blue_yMin}
            C${528.5 + blue_xMax} ${153.5 + blue_yMin} ${528.5 + blue_xMax} ${242.5 + blue_yMin} ${528.5 + blue_xMax} ${279.5 + blue_yMin}

            L${528.5 + blue_xMax} ${288.5 + blue_yMin1a}
            C${528.5 + blue_xMax} ${311.5 + blue_yMin1a} ${493 + blue_xMax} ${311.5 + blue_yMin1a} ${493 + blue_xMax} ${311.5 + blue_yMin1a}

            L${533 + blue_xMid0a} ${311.5 + blue_yMin1a}
            C${433 + blue_xMid0a} ${311.5 + blue_yMin1a}
              ${433 + blue_xMid0a} ${359 + blue_yMid1a}
              ${533 + blue_xMid0a} ${359 + blue_yMid1a}

            L${553 + blue_xMax} ${359 + blue_yMid1a}

            L${553 + blue_xMax} ${359 + blue_yMid1a}
            C${693 + blue_xMax} ${359 + blue_yMid1a}
              ${696 + blue_xMax} ${502 + blue_yMid1b}
              ${556 + blue_xMax} ${502 + blue_yMid1b}

            L${556 + blue_xMax} ${502 + blue_yMid1b}
            C${556 + blue_xMax} ${502 + blue_yMid1b} ${465.5 + blue_xMax} ${503.123 + blue_yMid1b} ${466.5 + blue_xMax} ${538.774 + blue_yMid1b}
            C${467.5 + blue_xMax} ${574.426 + blue_yMid1b} ${524 + blue_xMax} ${575.549 + blue_yMid1b} ${524 + blue_xMax} ${538.774 + blue_yMid1b}
            C${524 + blue_xMax} ${502 + blue_yMid1b} ${439.5 + blue_xMax} ${502 + blue_yMid1b} ${439.5 + blue_xMax} ${502 + blue_yMid1b}

            L${429.5 + blue_xMid} ${503.5 + blue_yMid1b}
            C${387 + blue_xMid} ${503.5 + blue_yMid1b} ${408 + blue_xMid} ${561.5 + blue_yMid1b} ${381.5 + blue_xMid} ${561.5 + blue_yMid1b}
            C${355 + blue_xMid} ${561.5 + blue_yMid1b} ${374 + blue_xMid} ${503.5 + blue_yMid1b} ${329.5 + blue_xMid} ${503.5 + blue_yMid1b}

            L${325.5 + blue_xMid1e} ${503.5 + blue_yMid1b}
            C${293.5 + blue_xMid1e} ${503.5 + blue_yMid1b} ${187.5 + blue_xMid1e} ${503.5 + blue_yMid1b} ${188.5 + blue_xMid1e} ${592 + blue_yMid1b}
            C${189.5 + blue_xMid1e} ${680.5 + blue_yMid1b} ${311.5 + blue_xMid1e} ${680.5 + blue_yMid1b} ${312 + blue_xMid1e} ${592 + blue_yMid1b}
            C${312.5 + blue_xMid1e} ${503.5 + blue_yMid1b} ${202.5 + blue_xMid1e} ${503.5 + blue_yMid1b} ${175 + blue_xMid1e} ${503.5 + blue_yMid1b}

            L${125 + blue_xMid1f} ${503.5 + blue_yMid1b}
            C${70 + blue_xMid1f} ${503.5 + blue_yMid1b}
              ${70 + blue_xMid1f} ${557 + blue_yMid1b}
              ${125 + blue_xMid1f} ${557 + blue_yMid1b}

            L${200 + blue_xMid1g} ${557 + blue_yMid1b}
            C${280 + blue_xMid1g} ${557 + blue_yMid1b}
              ${280 + blue_xMid1g} ${657 + blue_yMid1b}
              ${200 + blue_xMid1g} ${657 + blue_yMid1b}

            L${150 + blue_xMid1f} ${657 + blue_yMid1b}
            C${-30 + blue_xMid1f} ${657 + blue_yMid1b}
              ${-30 + blue_xMid1f} ${703.5 + blue_yMax1b}
              ${150 + blue_xMid1f} ${703.5 + blue_yMax1b}

            L${171 + blue_xMid} ${703.5 + blue_yMax1b}
            C${212.5 + blue_xMid} ${703.5 + blue_yMax1b} ${359 + blue_xMid} ${707.5 + blue_yMax1b} ${358.5 + blue_xMid} ${608 + blue_yMax1b}
            C${358 + blue_xMid} ${508.5 + blue_yMax1b} ${219 + blue_xMid} ${512.5 + blue_yMax1b} ${219 + blue_xMid} ${608 + blue_yMax1b}
            C${219 + blue_xMid} ${703.5 + blue_yMax1b} ${365.5 + blue_xMid} ${703.5 + blue_yMax1b} ${400.5 + blue_xMid} ${703.5 + blue_yMax1b}

            L${404.5 + blue_xMid} ${703.5 + blue_yMax1b}
            C${426.5 + blue_xMid} ${703 + blue_yMax1b} ${427 + blue_xMid} ${690 + blue_yMax1b} ${427 + blue_xMid} ${671.5 + blue_yMax1b}

            L${426 + blue_xMid} ${666.5 + blue_yMax1b}
            C${426 + blue_xMid} ${647.5 + blue_yMax1b} ${403.5 + blue_xMid} ${656.5 + blue_yMax1b} ${403.5 + blue_xMid} ${638.5 + blue_yMax1b}
            C${403.5 + blue_xMid} ${620.5 + blue_yMax1b} ${448 + blue_xMid} ${628.5 + blue_yMax1b} ${447.5 + blue_xMid} ${611.5 + blue_yMax1b}
            C${447 + blue_xMid} ${594.5 + blue_yMax1b} ${426 + blue_xMid} ${606 + blue_yMax1b} ${426 + blue_xMid} ${581 + blue_yMax1b}

            L${426 + blue_xMid} ${569 + blue_yMid1c}
            C${426 + blue_xMid} ${553 + blue_yMid1c} ${438.5 + blue_xMid} ${550 + blue_yMid1c} ${450 + blue_xMid} ${550 + blue_yMid1c}

            L${599 + blue_xMax0} ${547 + blue_yMid1c}
            C${620.5 + blue_xMax0} ${547 + blue_yMid1c} ${635 + blue_xMax0} ${554.5 + blue_yMid1c} ${635 + blue_xMax0} ${575.5 + blue_yMid1c}
            C${635 + blue_xMax0} ${601 + blue_yMid1c} ${635.5 + blue_xMax0} ${699 + blue_yMid1c} ${565.5 + blue_xMax0} ${699 + blue_yMid1c}
            C${495.5 + blue_xMax0} ${699 + blue_yMid1c} ${495.5 + blue_xMax0} ${593.5 + blue_yMid1c} ${565.5 + blue_xMax0} ${593.5 + blue_yMid1c}
            C${635.5 + blue_xMax0} ${593.5 + blue_yMid1c} ${635 + blue_xMax0} ${684.5 + blue_yMid1c} ${635 + blue_xMax0} ${713.5 + blue_yMid1c}
            C${635 + blue_xMax0} ${733.5 + blue_yMid1c} ${624.5 + blue_xMax0} ${743 + blue_yMid1c} ${599 + blue_xMax0} ${743 + blue_yMid1c}

            L${520 + blue_xMax1a} ${742.5 + blue_yMid1c}
            C${507 + blue_xMax1a} ${742.5 + blue_yMid1c} ${498.5 + blue_xMax1a} ${733 + blue_yMid1c} ${498.5 + blue_xMax1a} ${720.5 + blue_yMid1c}

            L${498.5 + blue_xMax1a} ${644.5 + blue_yMid1c}
            C${498.5 + blue_xMax1a} ${633.5 + blue_yMid1c} ${491.5 + blue_xMax1a} ${622 + blue_yMid1c} ${479.5 + blue_xMax1a} ${622 + blue_yMid1c}

            L${475 + blue_xMax1a} ${622 + blue_yMid1c}
            C${475 + blue_xMax1a} ${622 + blue_yMid1c} ${445 + blue_xMax1a} ${621.466 + blue_yMid1c} ${445 + blue_xMax1a} ${659.721 + blue_yMid1c}
            C${445 + blue_xMax1a} ${697.975 + blue_yMid1c} ${445 + blue_xMax1a} ${714 + blue_yMid1c} ${445 + blue_xMax1a} ${714 + blue_yMid1c}
            V${640 + blue_yMax}

          `;

          // (^(<path d=")|(" stroke="#933800" stroke-width="6"/>)$)

          // (\d)(C|L|M|Q|C|S|T|A|L|H|V|Z)
          // $1\n$2

          // ^(C|M|L|H|V)(-?\d*\.?\d*)
          // $1${$2 + blue_xMin}

          // (\d)\s(-?\d+\.?\d*)
          // $1 ${$2 + blue_xMin}

          // \}\s(-?\d*\.?\d*)
          // } ${$1 + blue_yMax}

          const yellow_xMin = 10
          const yellow_xMin1a = 10 + (boundsWidth * 0.05)
          const yellow_xMin1b = 10 + (boundsWidth * 0.08)
          const yellow_xMin1c = 10 + (boundsWidth * 0.12)
          const yellow_xMin1d = 10 + (boundsWidth * 0.16)
          const yellow_xMid = svgWidth / 2 - 20
          // const yellow_xMid1a = svgWidth / 2 - 40
          const yellow_xMid1a = svgWidth / 2 - (boundsWidth * 0.05) + 110
          const yellow_xMid1b = svgWidth / 2 - svgWidth / 3 + 10
          // const yellow_xMid2a = svgWidth + svgWidth / 5
          // const yellow_xMid2b = svgWidth + (boundsWidth * 0.01)
          const yellow_xMax = svgWidth - svgWidth / 4
          // const yellow_xMax1a = yellow_xMax - (boundsWidth * 0.01)
          // const yellow_xMax1b = yellow_xMax - (boundsWidth * 0.05)
          // const yellow_xMax2a = yellow_xMax - (boundsWidth * 0.01)
          const yellow_yMin = (boundsHeight * 0.03)
          // const yellow_yMin1a = svgHeight / 2 - (boundsHeight * 0.12)
          const yellow_yMin1a = svgHeight / 9 - (boundsHeight * 0.035)
          const yellow_yMin1b = svgHeight / 9 - (boundsHeight * 0.09)
          // const yellow_yMid = svgHeight / 2 - svgHeight / 3.5
          const yellow_yMid2a = svgHeight / 2 + (boundsHeight * 0.003) - svgHeight / 12
          // const yellow_yMax = svgHeight
          // const yellow_yMax1a = svgHeight + 12
          // const yellow_yMax = svgHeight - (boundsHeight * 0.5)
          const yellow_yMax2a = svgHeight - 120
          const yellow_yMax2b = svgHeight - 105

          const pathYellow = `

            M${260 + yellow_xMid} ${235.5 + yellow_yMin}
            C${260 + yellow_xMid} ${235.5 + yellow_yMin} ${199.5 + yellow_xMid} ${235.5 + yellow_yMin} ${186.5 + yellow_xMid} ${235.5 + yellow_yMin}
            C${100 + yellow_xMid1b} ${235.5 + yellow_yMin} ${66 + yellow_xMid1b} ${204 + yellow_yMin} ${64 + yellow_xMid1b} ${128 + yellow_yMin}

            L${64 + yellow_xMid1b} ${127.5 + yellow_yMin}
            V${120 + yellow_yMin}
            C${64 + yellow_xMid1b} ${120 + yellow_yMin} ${64.5 + yellow_xMid1b} ${44.5 + yellow_yMin} ${133 + yellow_xMid1b} ${44 + yellow_yMin}
            C${201.5 + yellow_xMid1b} ${43.5 + yellow_yMin} ${202 + yellow_xMid1b} ${137 + yellow_yMin} ${133 + yellow_xMid1b} ${136.5 + yellow_yMin}
            C${64 + yellow_xMid1b} ${136 + yellow_yMin} ${64 + yellow_xMid1b} ${54 + yellow_yMin} ${64 + yellow_xMid1b} ${45 + yellow_yMin}
            C${64 + yellow_xMid1b} ${45 + yellow_yMin} ${64 + yellow_xMid1b} ${16.5 + yellow_yMin} ${35 + yellow_xMid1b} ${16.5 + yellow_yMin}

            L${32 + yellow_xMin} ${16.5 + yellow_yMin}
            C${3 + yellow_xMin} ${16.5 + yellow_yMin} ${3 + yellow_xMin} ${45 + yellow_yMin} ${3 + yellow_xMin} ${45 + yellow_yMin}
            V${162.5 + yellow_yMin}

            L${3 + yellow_xMin} ${197 + yellow_yMin}
            C${3 + yellow_xMin} ${215.5 + yellow_yMin} ${3.00007 + yellow_xMin} ${233.5 + yellow_yMin} ${15 + yellow_xMin} ${237.5 + yellow_yMin}
            C${26.9999 + yellow_xMin} ${241.5 + yellow_yMin} ${47 + yellow_xMin} ${218.5 + yellow_yMin} ${53 + yellow_xMin} ${237.5 + yellow_yMin}
            C${59 + yellow_xMin} ${256.5 + yellow_yMin} ${-7.54855 + yellow_xMin} ${273.431 + yellow_yMin} ${17 + yellow_xMin} ${308.5 + yellow_yMin}
            C${26.5 + yellow_xMin} ${322 + yellow_yMin} ${26.5 + yellow_xMin} ${327.5 + yellow_yMin} ${26.5 + yellow_xMin} ${334.5 + yellow_yMin}

            L${26.5 + yellow_xMin} ${353 + yellow_yMin1a}
            C${26.5 + yellow_xMin} ${377.5 + yellow_yMin1a} ${49.5 + yellow_xMin} ${377.5 + yellow_yMin1a} ${49.5 + yellow_xMin} ${377.5 + yellow_yMin1a}

            L${100 + yellow_xMin1a} ${377.5 + yellow_yMin1a}
            C${100 + yellow_xMin1a} ${377.5 + yellow_yMin1a} ${199 + yellow_xMin1a} ${377.5 + yellow_yMin1a} ${199 + yellow_xMin1a} ${318.5 + yellow_yMin1a}
            C${199 + yellow_xMin1a} ${266 + yellow_yMin1a} ${117.193 + yellow_xMin1a} ${264.5 + yellow_yMin1a} ${118 + yellow_xMin1a} ${321 + yellow_yMin1a}
            C${118.807 + yellow_xMin1a} ${377.5 + yellow_yMin1a} ${218 + yellow_xMin1a} ${377.5 + yellow_yMin1a} ${218 + yellow_xMin1a} ${377.5 + yellow_yMin1a}

            L${230.5 + yellow_xMin1b} ${377.5 + yellow_yMin1a}
            C${282 + yellow_xMin1c} ${377.5 + yellow_yMin1a} ${282 + yellow_xMin1c} ${346.5 + yellow_yMin1a} ${282 + yellow_xMin1c} ${346.5 + yellow_yMin1a}
            C${282 + yellow_xMin1c} ${346.5 + yellow_yMin1b} ${282 + yellow_xMin1d} ${321 + yellow_yMin1b} ${352 + yellow_xMin1d} ${323.5 + yellow_yMin1b}

            L${296.5 + yellow_xMid1a} ${323.5 + yellow_yMin1b}
            C${296.5 + yellow_xMid1a} ${323.5 + yellow_yMin1b} ${383.554 + yellow_xMid1a} ${323.5 + yellow_yMin1b} ${384.5 + yellow_xMid1a} ${364.5 + yellow_yMin1b}
            C${385.446 + yellow_xMid1a} ${405.5 + yellow_yMin1b} ${325 + yellow_xMid1a} ${405.5 + yellow_yMin1b} ${325 + yellow_xMid1a} ${364.5 + yellow_yMin1b}
            C${325 + yellow_xMid1a} ${323.5 + yellow_yMin1b} ${412 + yellow_xMid1a} ${323.5 + yellow_yMin1b} ${412 + yellow_xMid1a} ${323.5 + yellow_yMin1b}

            L${470.5 + yellow_xMax} ${323.5 + yellow_yMin1b}
            H${490 + yellow_xMax}
            C${511 + yellow_xMax} ${323.5 + yellow_yMin1b} ${527 + yellow_xMax} ${323.5 + yellow_yMin1b} ${527 + yellow_xMax} ${356.501 + yellow_yMin1b}
            V${393.501 + yellow_yMin1b}
            C${527 + yellow_xMax} ${428 + yellow_yMin1b} ${570.5 + yellow_xMax} ${429 + yellow_yMin1b} ${570.5 + yellow_xMax} ${393.501 + yellow_yMin1b}
            C${570.5 + yellow_xMax} ${358.001 + yellow_yMin1b} ${570.5 + yellow_xMax} ${345 + yellow_yMin1b} ${570.5 + yellow_xMax} ${249 + yellow_yMin1b}
            C${570.5 + yellow_xMax} ${205.5 + yellow_yMin1b} ${622 + yellow_xMax} ${206 + yellow_yMin1b} ${622 + yellow_xMax} ${249 + yellow_yMin1b}

            L${622 + yellow_xMax} ${408 + yellow_yMid2a}
            V${441 + yellow_yMid2a}
            C${622 + yellow_xMax} ${492.5 + yellow_yMid2a} ${601.5 + yellow_xMax} ${506 + yellow_yMid2a} ${574 + yellow_xMax} ${506 + yellow_yMid2a}

            L${523 + yellow_xMid} ${506 + yellow_yMid2a}
            C${467 + yellow_xMid} ${506 + yellow_yMid2a} ${423.5 + yellow_xMid} ${531.5 + yellow_yMid2a} ${365 + yellow_xMid} ${531.5 + yellow_yMid2a}
            C${306.5 + yellow_xMid} ${531.5 + yellow_yMid2a} ${220.5 + yellow_xMid} ${544.5 + yellow_yMid2a} ${245.5 + yellow_xMid} ${609.5 + yellow_yMid2a}
            C${292.5 + yellow_xMid} ${683 + yellow_yMid2a} ${400 + yellow_xMid} ${556.5 + yellow_yMid2a} ${480 + yellow_xMid} ${547 + yellow_yMid2a}
            C${560 + yellow_xMid} ${537.5 + yellow_yMid2a} ${584 + yellow_xMid} ${616.5 + yellow_yMid2a} ${499.5 + yellow_xMid} ${638 + yellow_yMid2a}
            C${415 + yellow_xMid} ${659.5 + yellow_yMid2a} ${373 + yellow_xMid} ${506 + yellow_yMid2a} ${296.5 + yellow_xMid} ${506 + yellow_yMid2a}

            L${253.5 + yellow_xMid} ${506 + yellow_yMid2a}
            C${253.5 + yellow_xMid} ${506 + yellow_yMid2a} ${141.562 + yellow_xMid} ${506 + yellow_yMid2a} ${142.5 + yellow_xMid} ${559 + yellow_yMid2a}
            C${143.438 + yellow_xMid} ${612 + yellow_yMid2a} ${217.5 + yellow_xMid} ${612 + yellow_yMid2a} ${217 + yellow_xMid} ${559 + yellow_yMid2a}
            C${216.5 + yellow_xMid} ${506 + yellow_yMid2a} ${102.5 + yellow_xMid} ${506 + yellow_yMid2a} ${102.5 + yellow_xMid} ${506 + yellow_yMid2a}

            L${101 + yellow_xMin} ${506 + yellow_yMid2a}
            C${67.5 + yellow_xMin} ${506 + yellow_yMid2a} ${34.5 + yellow_xMin} ${523 + yellow_yMid2a} ${34.5 + yellow_xMin} ${563.001 + yellow_yMid2a}

            L${34.5 + yellow_xMin} ${570 + yellow_yMax2a}
            C${34.5 + yellow_xMin} ${570 + yellow_yMax2a} ${31.0002 + yellow_xMin} ${644.5 + yellow_yMax2a} ${80.5002 + yellow_xMin} ${644.5 + yellow_yMax2a}
            C${130 + yellow_xMin} ${644.5 + yellow_yMax2a} ${127.5 + yellow_xMin} ${585 + yellow_yMax2a} ${80.5002 + yellow_xMin} ${585 + yellow_yMax2a}
            C${33.5002 + yellow_xMin} ${585 + yellow_yMax2a} ${31.5002 + yellow_xMin} ${659 + yellow_yMax2a} ${31.5002 + yellow_xMin} ${659 + yellow_yMax2a}

            L${34.5 + yellow_xMin} ${761 + yellow_yMax2b}
            C${34.5 + yellow_xMin} ${788.5 + yellow_yMax2b} ${61 + yellow_xMin} ${814.5 + yellow_yMax2b} ${86 + yellow_xMin} ${814.5 + yellow_yMax2b}
            H${yellow_xMin + (svgWidth / 4) + 10}

          `;

          const red_xMin = 10
          const red_xMid = svgWidth / 2
          const red_xMid1a = svgWidth / 2 - 40
          const red_xMid1b = svgWidth / 2 - svgWidth / 4
          // const red_xMid2a = svgWidth + svgWidth / 5
          // const red_xMid2b = svgWidth + (boundsWidth * 0.01)
          const red_xMax = svgWidth - 10
          const red_xMax1a = red_xMax - (boundsWidth * 0.01)
          const red_xMax1b = red_xMax - (boundsWidth * 0.05)
          const red_xMax2a = red_xMax - (boundsWidth * 0.01)
          const red_xMax2c = svgWidth - (svgHeight / 4)
          const red_yMin = (boundsHeight * 0.03)
          const red_yMin1a = svgHeight / 9 - (boundsHeight * 0.05)
          const red_yMid = svgHeight / 2 - svgHeight / 3.5
          // const red_yMax = svgHeight
          const red_yMax1a = svgHeight + 12
          // const red_yMax = svgHeight - (boundsHeight * 0.5)
          const red_yMax2a = svgHeight - 120
          const red_yMax2b = svgHeight - 105

          const pathRed = `

            M${251 + red_xMid1a} ${160 + red_yMin}
            C${221 + red_xMid1a} ${160 + red_yMin} ${186.5 + red_xMid1a} ${160 + red_yMin} ${156.5 + red_xMid1a} ${160 + red_yMin}
            C${126.5 + red_xMid1a} ${160 + red_yMin} ${89.5002 + red_xMid1a} ${149.5 + red_yMin} ${89.5002 + red_xMid1a} ${107 + red_yMin}
            C${89.5002 + red_xMid1a} ${64.5 + red_yMin} ${89.5002 + red_xMid1a} ${94.5 + red_yMin} ${89.5002 + red_xMid1a} ${94.5 + red_yMin}

            L${89.5002 + red_xMid1a} ${94.5 + red_yMin}
            C${89.5002 + red_xMid1a} ${94.5 + red_yMin} ${89.5002 + red_xMid1a} ${94.5 + red_yMin} ${89.5002 + red_xMid1a} ${53.5 + red_yMin}
            C${89.5002 + red_xMid1a} ${6.99999 + red_yMin} ${158.5 + red_xMid1a} ${7.5 + red_yMin} ${158.5 + red_xMid1a} ${53.5 + red_yMin}
            C${158.5 + red_xMid1a} ${94.5 + red_yMin} ${135.5 + red_xMid1a} ${94.5 + red_yMin} ${126.5 + red_xMid1a} ${94.5 + red_yMin}
            C${112.5 + red_xMid1a} ${94.5 + red_yMin} ${89.5002 + red_xMid1a} ${94.5 + red_yMin} ${89.5002 + red_xMid1a} ${94.5 + red_yMin}

            L${79.5002 + red_xMin} ${94.5 + red_yMin}
            H${67.0002 + red_xMin}
            C${-7.5 + red_xMin} ${94.5 + red_yMin} ${-7.50006 + red_xMin} ${205.5 + red_yMin} ${67.0002 + red_xMin} ${205.5 + red_yMin}

            L${68.5002 + red_xMid1b} ${205.5 + red_yMin}
            C${68.5002 + red_xMid1b} ${205.5 + red_yMin} ${152.5 + red_xMid1b} ${205.5 + red_yMin} ${153.5 + red_xMid1b} ${255 + red_yMin}
            C${153.5 + red_xMid1b} ${302.5 + red_yMin} ${92.5002 + red_xMid1b} ${299.5 + red_yMin} ${92.5002 + red_xMid1b} ${255 + red_yMin}
            C${93.0002 + red_xMid1b} ${205.5 + red_yMin} ${177 + red_xMid1b} ${205.5 + red_yMin} ${177 + red_xMid1b} ${205.5 + red_yMin}

            L${178.5 + red_xMid1b} ${206 + red_yMin}
            C${196 + red_xMid1b} ${206.5 + red_yMin} ${205.5 + red_xMid1b} ${217 + red_yMin} ${205.5 + red_xMid1b} ${232.5 + red_yMin}

            L${205.5 + red_xMid1b} ${277.5 + red_yMin1a}
            C${205.5 + red_xMid1b} ${277.5 + red_yMin1a} ${205.5 + red_xMid1b} ${289.5 + red_yMin1a} ${205.5 + red_xMid1b} ${307.5 + red_yMin1a}
            C${205.5 + red_xMid1b} ${325.5 + red_yMin1a} ${219 + red_xMid1b} ${335.5 + red_yMin1a} ${237 + red_xMid1b} ${335.5 + red_yMin1a}

            L${279 + red_xMax1a} ${335.5 + red_yMin1a}
            C${331 + red_xMax1a} ${335.5 + red_yMin1a} ${345 + red_xMax1a} ${378 + red_yMin1a} ${374 + red_xMax1a} ${377.5 + red_yMin1a}
            C${403 + red_xMax1a} ${377 + red_yMin1a} ${380 + red_xMax1a} ${326.5 + red_yMin1a} ${413 + red_xMax1a} ${289.5 + red_yMin1a}
            C${446 + red_xMax1a} ${252.5 + red_yMin1a} ${508.5 + red_xMax1a} ${271 + red_yMin1a} ${513.5 + red_xMax1a} ${325.5 + red_yMin1a}
            C${518.5 + red_xMax1a} ${380 + red_yMin1a} ${483.5 + red_xMax1a} ${404 + red_yMin1a} ${449 + red_xMax1a} ${404 + red_yMin1a}
            H${374 + red_xMax1a}

            L${306.5 + red_xMax1b} ${404 + red_yMin1a}
            C${306.5 + red_xMax1b} ${404 + red_yMin1a} ${241.5 + red_xMax1b} ${404 + red_yMin1a} ${241 + red_xMax1b} ${372.5 + red_yMin1a}
            C${241.5 + red_xMax1b} ${349.5 + red_yMin1a} ${277.5 + red_xMax1b} ${349 + red_yMin1a} ${277.5 + red_xMax1b} ${372.5 + red_yMin1a}
            C${278 + red_xMax1b} ${404 + red_yMin1a} ${216.5 + red_xMax1b} ${404 + red_yMin1a} ${216.5 + red_xMax1b} ${404 + red_yMin1a}

            L${180 + red_xMin} ${404.5 + red_yMin1a}
            H${146 + red_xMin}
            C${89.5 + red_xMin} ${404.5 + red_yMin1a} ${30 + red_xMin} ${389.5 + red_yMin1a} ${14 + red_xMin} ${351.5 + red_yMin1a}
            C${-2 + red_xMin} ${313.5 + red_yMin1a} ${20.5 + red_xMin} ${296.5 + red_yMin1a} ${20.5 + red_xMin} ${296.5 + red_yMin1a}
            C${20.5 + red_xMin} ${296.5 + red_yMin1a} ${52.5001 + red_xMin} ${271 + red_yMin1a} ${84 + red_xMin} ${306.5 + red_yMin1a}
            C${121.5 + red_xMin} ${351.5 + red_yMin1a} ${69.5 + red_xMin} ${389.5 + red_yMin1a} ${69.5 + red_xMin} ${436 + red_yMin1a}

            L${69.5002 + red_xMin} ${611 + red_yMax2a}
            C${69.5002 + red_xMin} ${666 + red_yMax2a} ${128 + red_xMin} ${667 + red_yMax2a} ${128 + red_xMin} ${611 + red_yMax2a}

            L${128 + red_xMin} ${541 + red_yMid}
            C${128 + red_xMin} ${487 + red_yMid} ${182.5 + red_xMin} ${488 + red_yMid} ${182.5 + red_xMin} ${541 + red_yMid}

            L${182.5 + red_xMin} ${565.5 + red_yMax2a}
            C${182.5 + red_xMin} ${585.5 + red_yMax2a} ${185 + red_xMin} ${606 + red_yMax2a} ${226 + red_xMin} ${606 + red_yMax2a}

            L${271 + red_xMid} ${606 + red_yMax2a}
            C${271 + red_xMid} ${606 + red_yMax2a} ${348 + red_xMid} ${606 + red_yMax2a} ${348 + red_xMid} ${571.5 + red_yMax2a}
            C${348 + red_xMid} ${539 + red_yMax2a} ${303 + red_xMid} ${538.5 + red_yMax2a} ${303 + red_xMid} ${571.5 + red_yMax2a}
            C${303 + red_xMid} ${606 + red_yMax2a} ${385 + red_xMid} ${606 + red_yMax2a} ${385 + red_xMid} ${606 + red_yMax2a}

            L${432.5 + red_xMax2a} ${606 + red_yMax2a}
            C${432.5 + red_xMax2a} ${606 + red_yMax2a} ${505 + red_xMax2a} ${606 + red_yMax2a} ${505 + red_xMax2a} ${636.5 + red_yMax2a}
            C${505 + red_xMax2a} ${667 + red_yMax2a} ${458 + red_xMax2a} ${667 + red_yMax2a} ${458 + red_xMax2a} ${636.5 + red_yMax2a}
            C${458 + red_xMax2a} ${606 + red_yMax2a} ${532.5 + red_xMax2a} ${606 + red_yMax2a} ${532.5 + red_xMax2a} ${606 + red_yMax2a}

            L${566.5 + red_xMax2a} ${606 + red_yMax2a}
            C${619.5 + red_xMax2a} ${606 + red_yMax2a} ${619.5 + red_xMax2a} ${650 + red_yMax2a} ${619.5 + red_xMax2a} ${650 + red_yMax2a}

            L${623 + red_xMax2a} ${761 + red_yMax2b}
            C${623 + red_xMax2a} ${790 + red_yMax2b} ${597.5 + red_xMax2a} ${814.5 + red_yMax2b} ${572 + red_xMax2a} ${814.5 + red_yMax2b}
            H${623 + red_xMax2a - (svgWidth * 0.25)}

          `;

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
                  boundingBox: { path: boundingBox, color: '#F2563D' },
                  pathGreen: { path: pathGreen, color: '#39A256', duration: 11, },
                  pathBlue: { path: pathBlue, color: '#324BF7', duration: 10, },
                  // pathYellow: { path: pathYellow, color: '#D3CC5B', duration: 10, },
                  pathYellow: { path: pathYellow, color: '#FFFF00', duration: 10, },
                  pathRed: { path: pathRed, color: '#FF0000', duration: 10, },
                }}
                preserveAspectRatio={_preserveAspectRatio}
                strokeSize={strokeSize} scale={scale}
                viewbox={{ width: viewBoxWidth, height: viewBoxHeight }}
                offset={{ x: translateX, y: translateY }}
                ratio={ratio}
                showMatte={showMatte}
                mode='mob'
              />
            </>
          )
        }}
      </MeasureAndRender>
    </div>
  )
}

export default observer(LinePaths)
