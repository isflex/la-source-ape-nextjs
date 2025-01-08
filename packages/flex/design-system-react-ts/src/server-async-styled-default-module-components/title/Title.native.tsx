import React from 'react'
import { StyleSheet, Text } from 'react-native'
import { TitleProps } from './TitleProps'

/**
 * Title Native Component
 * @param children {string} Text child
 * @param level {TextLevel|number} Title size : 1-4
 * @param inverted {Boolean} Title white color
 */
const Title = ({ children, level, style, inverted, ...others }: TitleProps): Promise<React.JSX.Element> => {
  const styles = StyleSheet.create({
    text: {
      fontFamily: 'Bouygues Speak',
      fontSize:
        (level && level === 1 && 45) ||
        (level && level === 2 && 40) ||
        (level && level === 3 && 35) ||
        (level && level === 4 && 30) ||
        (level && level === 5 && 25) ||
        (level && level === 6 && 20) ||
        (level && level === 7 && 15) ||
        10,
      color: inverted ? '#FFF' : '#25465f',
      fontWeight: 'bold',
    },
  })

  return (
    <Text style={[styles.text, style]} {...others}>
      {children}
    </Text>
  )
}

export default Title
