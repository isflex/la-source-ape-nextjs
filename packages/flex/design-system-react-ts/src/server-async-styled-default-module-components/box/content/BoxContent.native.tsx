import React from 'react'
import { StyleSheet, Text } from 'react-native'
import { BoxContentProps } from './BoxContentProps'
import { View } from '../../view'

/**
 * Box Content Component
 * @param children {ReactNode} Childrens
 */
const BoxContent = ({ children, ...others }: BoxContentProps): Promise<React.JSX.Element> => {
  const styles = StyleSheet.create({
    boxContent: {
      padding: 12,
      justifyContent: 'center',
    },
  })

  return (
    <View style={[styles.boxContent]} {...others}>
      {children && typeof children.valueOf() === 'string' ? <Text>{String(children)}</Text> : children}
    </View>
  )
}

export default BoxContent
