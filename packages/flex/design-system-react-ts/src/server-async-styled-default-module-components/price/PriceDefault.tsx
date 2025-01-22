'use server'

import React from 'react'
import classNames from 'classnames'
import { is, validate } from '../../services/index.js'
import { camelCase } from 'lodash'
import { PriceProps } from './PriceProps.js'
import { Text } from '../text/index.js'

// ///////////////////////////////////////////////////////////////////////////
// /!\ When typed-scss-modules --exportType default
import { default as styles, type Styles } from '@flex-design-system/framework'
// import { default as styles, type Styles } from '@flex-design-system/framework/main/all.module.scss'
// ///////////////////////////////////////////////////////////////////////////

/**
 * Price Component
 * @param variant {PriceVariant} Variant for Price (PRIMARY|SECONDARY)
 * @param amount {number} Amount for Price
 * @param mention {string} Mention for price ( (1)* )
 * @param period {string} Period for Price (mois)
 * @param showCents {boolean} Display cents
 * @param level {PriceLevel} Price custom size
 * @param huge {boolean} Price huge size
 * @param inverted {boolean} Inverted Price Color
 * - -------------------------- WEB PROPERTIES -------------------------------
 * @param className {string} Additionnal css classes
 * @param classList {array} Additionnal css classes
 */
const Price = async ({
  className,
  classList,
  variant,
  amount,
  mention,
  period,
  showCents,
  level,
  huge,
  inverted,
  ...others
}: PriceProps): Promise<React.AwaitedReactNode> => {
  const classes = classNames(
    styles.price,
    variant && styles[camelCase(is(`${variant}`)) as keyof Styles],
    level && !huge && styles[camelCase(is(`${level}`)) as keyof Styles],
    huge && !level && styles.isHuge,
    inverted && styles.isInverted,
    className,
    validate(classList),
  )

  const isNegative = amount < 0
  const absoluteAmount = Math.abs(amount)
  // Math.floor on negative decimal decrease its value (as expected), ex: Math.floor(-17.09) => -18
  // Use of Math.abs prevent this in our case
  const absoluteWhole = Math.floor(absoluteAmount)
  const whole = isNegative ? -absoluteWhole : absoluteWhole
  // Floating point problem Math.floor gives inconsistent results with decimals,
  // Math.round prevents it and is enough with prices decimals
  // ex: (17.09 - 17) * 100 = 8.999999999999986 > Floating point problem
  // ex: Math.round((17.09 - 17) * 100) = 9 > Expected result
  // For more informations https://floating-point-gui.de/
  const cents = Math.floor(Math.round((absoluteAmount - absoluteWhole) * 100))
    .toString()
    .padStart(2, '0')

  return (
    <div className={classes} {...others}>
      <Text className={styles.main}>{`${whole}`}</Text>
      <span className={styles.priceDetails}>
        <span className={styles.cents}>
          €{showCents && cents}
          {mention && <sup>{mention}</sup>}
        </span>
        {period && <span className={styles.period}>/{period}</span>}
      </span>
    </div>
  )
}

export default Price
