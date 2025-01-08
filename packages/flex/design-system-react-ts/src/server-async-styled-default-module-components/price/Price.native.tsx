import React from 'react'
import { StyleSheet, Text } from 'react-native'
import { PriceProps } from './PriceProps'
import { PriceVariant, PriceLevel } from './PriceEnum'
import { View } from '../view'

/**
 * Price Component
 * @param className {string} Additionnal CSS Classes
 * @param variant {PriceVariant} Variant for Price (PRIMARY|SECONDARY)
 * @param amount {number} Amount for Price
 * @param mention {string} Mention for price ( (1)* )
 * @param period {string} Period for Price (mois)
 * @param showCents {boolean} Display cents
 * @param level {PriceLevel} Price custom size
 * @param huge {boolean} Price huge size
 * @param inverted {boolean} Inverted Price Color
 */
const Price = ({
  variant,
  amount,
  mention,
  period,
  showCents,
  level,
  huge,
  inverted,
  ...others
}: PriceProps): Promise<React.JSX.Element> => {
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

  const primaryColor = '#25465f'
  const secondaryColor = '#109db9'
  const invertedColor = '#fff'

  const LEVEL1 = {
    price: 45,
    cents: 15,
  }

  const LEVEL2 = {
    price: 40,
    cents: 13,
  }

  const LEVEL3 = {
    price: 35,
    cents: 11,
  }

  const LEVEL4 = {
    price: 30,
    cents: 9,
  }

  const LEVEL5 = {
    price: 25,
    cents: 7,
  }

  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
    },
    priceContainer: {
      padding: 0,
      flexDirection: 'column',
      justifyContent: 'center',
      width: 'auto',
    },
    price: {
      fontSize:
        (huge && LEVEL1.price) ||
        (level === PriceLevel.LEVEL1 && LEVEL1.price) ||
        (level === PriceLevel.LEVEL2 && LEVEL2.price) ||
        (level === PriceLevel.LEVEL3 && LEVEL3.price) ||
        (level === PriceLevel.LEVEL4 && LEVEL4.price) ||
        (level === PriceLevel.LEVEL5 && LEVEL5.price) ||
        LEVEL3.price,
      fontWeight: 'bold',
      color:
        (variant === PriceVariant.PRIMARY && primaryColor) ||
        (variant === PriceVariant.SECONDARY && secondaryColor) ||
        (inverted && invertedColor) ||
        primaryColor,
    },
    cents: {
      fontWeight: 'bold',
      color:
        (variant === PriceVariant.PRIMARY && primaryColor) ||
        (variant === PriceVariant.SECONDARY && secondaryColor) ||
        (inverted && invertedColor) ||
        primaryColor,
      fontSize:
        (huge && LEVEL1.cents) ||
        (level === PriceLevel.LEVEL1 && LEVEL1.cents) ||
        (level === PriceLevel.LEVEL2 && LEVEL2.cents) ||
        (level === PriceLevel.LEVEL3 && LEVEL3.cents) ||
        (level === PriceLevel.LEVEL4 && LEVEL4.cents) ||
        (level === PriceLevel.LEVEL5 && LEVEL5.cents) ||
        LEVEL3.cents,
    },
    period: {
      color:
        (variant === PriceVariant.PRIMARY && primaryColor) ||
        (variant === PriceVariant.SECONDARY && secondaryColor) ||
        (inverted && invertedColor) ||
        primaryColor,
      fontSize:
        (huge && LEVEL1.cents) ||
        (level === PriceLevel.LEVEL1 && LEVEL1.cents) ||
        (level === PriceLevel.LEVEL2 && LEVEL2.cents) ||
        (level === PriceLevel.LEVEL3 && LEVEL3.cents) ||
        (level === PriceLevel.LEVEL4 && LEVEL4.cents) ||
        (level === PriceLevel.LEVEL5 && LEVEL5.cents) ||
        LEVEL3.cents,
    },
  })

  return (
    <View style={styles.container} {...others}>
      <View style={styles.priceContainer}>
        <Text style={styles.price}>{`${whole}`}</Text>
      </View>
      <View style={styles.priceContainer}>
        <Text style={styles.cents}>
          €{showCents && cents}
          {mention && mention}
        </Text>
        <Text style={styles.period}>{period && `/${period}`}</Text>
      </View>
    </View>
  )
}

export default Price
