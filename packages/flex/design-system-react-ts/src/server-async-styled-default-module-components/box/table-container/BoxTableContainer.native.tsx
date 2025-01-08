import React from 'react'
import { StyleSheet } from 'react-native'
import { BoxTableContainerProps } from './BoxTableContainerProps'
import { View } from '../../view'

/**
 * Box Header Component
 * @param children {ReactNode} Childrens
 */
const BoxFooter = ({ children, ...others }: BoxTableContainerProps): Promise<React.JSX.Element> => {
  const styles = StyleSheet.create({
    boxTableContainer: {},
  })

  return (
    <View style={[styles.boxTableContainer]} {...others}>
      {children}
    </View>
  )
}

export default BoxFooter
