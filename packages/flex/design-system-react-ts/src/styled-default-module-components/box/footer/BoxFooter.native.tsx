import React from 'react'
import { StyleSheet, Text } from 'react-native'
import { BoxFooterProps } from './BoxFooterProps'
import { View } from '../../view'

/**
 * Box Content Component
 * @param children {ReactNode} Childrens
 */
const BoxFooter = ({ children, ...others }: BoxFooterProps): React.JSX.Element => {
  const borderTopColor = '#ececec'

  const styles = StyleSheet.create({
    boxFooter: {
      borderTopWidth: 1,
      borderTopColor: borderTopColor,
      padding: 12,
      justifyContent: 'center',
    },
  })

  return (
    <View style={[styles.boxFooter]} {...others}>
      {children && typeof children.valueOf() === 'string' ? <Text>{String(children)}</Text> : children}
    </View>
  )
}

export default BoxFooter
