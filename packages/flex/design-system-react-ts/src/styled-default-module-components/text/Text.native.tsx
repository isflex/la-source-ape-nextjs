import React from 'react'
import { StyleSheet, Text as TextNative } from 'react-native'
import { TextProps } from './TextProps'

/**
 * Text Native Component
 * @param children {string} Text child
 * @param level {TextLevel|number} Title size : 1-4
 * @param inverted {Boolean} Text white color
 */
const Text = ({ children, level, style, inverted, ...others }: TextProps): React.JSX.Element => {
  const textLevel = {
    size:
      (level && level === 1 && 25) ||
      (level && level === 2 && 20) ||
      (level && level === 3 && 15) ||
      (level && level === 4 && 10) ||
      10,
  }

  const styles = StyleSheet.create({
    text: {
      fontFamily: 'Bouygues Read',
      fontSize: textLevel.size,
      color: inverted ? '#FFF' : '#25465f',
      fontWeight:
        (level && level === 1 && '400') ||
        (level && level === 2 && '600') ||
        (level && level === 3 && '300') ||
        (level && level === 4 && '400') ||
        '100',
    },
  })

  return (
    <TextNative style={[styles.text, style]} {...others}>
      {children}
    </TextNative>
  )
}

export default Text
