import React from 'react'
import { StyleSheet } from 'react-native'
import { BoxProps } from './BoxProps'
import { View } from '../view'

/**
 * Box Component
 * @param children {ReactNode} Childrens
 */
const Box = ({ children, ...others }: BoxProps): Promise<React.JSX.Element> => {
  const shadowColor = 'rgba(0,0,0,.1)'
  const colorBgc = '#fff'

  const styles = StyleSheet.create({
    box: {
      backgroundColor: colorBgc,
      borderRadius: 6,
      flexDirection: 'column',
      justifyContent: 'flex-start',
      position: 'relative',
    },
    shadow: {
      shadowColor: shadowColor,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.8,
      shadowRadius: 2,
      elevation: 5,
    },
  })

  return (
    <View style={[styles.box, styles.shadow]} {...others}>
      {children}
    </View>
  )
}

export default Box
