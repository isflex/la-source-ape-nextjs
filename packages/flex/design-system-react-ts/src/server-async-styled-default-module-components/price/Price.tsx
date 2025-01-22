'use server'

import React from 'react'
import classNames from 'classnames'
import { PriceProps } from './PriceProps.js'
import { is } from '../../services/index.js'
import { Text } from '../text/index.js'

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
 * @param className {string} Additionnal CSS Classes
 */
const Price = async ({
  className,
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
    'price',
    variant && is(`${variant}`),
    level && !huge && is(`${level}`),
    huge && !level && is('huge'),
    inverted && is('inverted'),
    className,
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
      <Text className='main'>{`${whole}`}</Text>
      <span className='price-details'>
        <span className='cents'>
          €{showCents && cents}
          {mention && <sup>{mention}</sup>}
        </span>
        {period && <span className='period'>/{period}</span>}
      </span>
    </div>
  )
}

export default Price
