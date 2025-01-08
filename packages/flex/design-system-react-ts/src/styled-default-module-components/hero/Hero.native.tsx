import React from 'react'
import { StyleSheet, ImageBackground } from 'react-native'
import { HeroProps } from './HeroProps'
import { View } from '../view'

/**
 * Hero Component
 * @param children {ReactNode} Hero Children
 * @param backgroundSrc {string} If source, it will display background option
 * @param variant {VariantState} Hero background color : primary|secondary|tertiary
 */
const Hero = ({ children, backgroundSrc, variant, ...others }: HeroProps): React.JSX.Element => {
  const styles = StyleSheet.create({
    hero: {
      width: '100%',
      minHeight: 100,
      maxHeight: 300,
    },
    content: {
      padding: 15,
    },
    variant: {
      backgroundColor: variant && variant.getStyle(),
    },
  })

  if (variant) {
    return (
      <View style={styles.variant}>
        <View style={styles.content}>{children}</View>
      </View>
    )
  }

  return (
    <ImageBackground source={{ uri: backgroundSrc }} style={styles.hero} {...others}>
      <View style={styles.content}>{children}</View>
    </ImageBackground>
  )
}

export default Hero
