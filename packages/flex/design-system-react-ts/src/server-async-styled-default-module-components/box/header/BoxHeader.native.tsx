import React from 'react'
import { StyleSheet, Text } from 'react-native'
import { BoxHeaderProps } from './BoxHeaderProps'
import { View } from '../../view'

/**
 * Box Header Component
 * @param children {ReactNode} Childrens
 */
const BoxFooter = ({ children, ...others }: BoxHeaderProps): Promise<React.JSX.Element> => {
  const footerBgc = '#25465f'
  const textColor = '#fff'

  const styles = StyleSheet.create({
    boxHeader: {
      width: '100%',
      backgroundColor: footerBgc,
      padding: 10,
      borderTopLeftRadius: 6,
      borderTopRightRadius: 6,
      justifyContent: 'center',
    },
    text: {
      color: textColor,
    },
  })

  return (
    <View style={[styles.boxHeader]} {...others}>
      {children && typeof children.valueOf() === 'string' ? (
        <Text style={styles.text}>{String(children)}</Text>
      ) : (
        children
      )}
    </View>
  )
}

export default BoxFooter
