import React from 'react'
import { StyleSheet } from 'react-native'
import { InfoBlockProps } from './InfoBlockProps'
import { View } from '../view'

/**
 * Info Block Component
 * @param children {React.ReactNode} Children for Info Block
 * @param boxed {boolean} Boxed block
 */
const InfoBlock = ({ children, boxed, ...others }: InfoBlockProps): React.JSX.Element => {
  const styles = StyleSheet.create({
    infoBlock: {
      width: '100%',
      minHeight: 30,
      backgroundColor: '#fff',
      paddingLeft: 20,
      paddingRight: 20,
      paddingTop: 15,
      paddingBottom: 15,
    },
    shadow: {
      shadowColor: 'rgba(0,0,0,.1)',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.8,
      shadowRadius: 2,
      elevation: 5,
    },
    outBoxed: {
      width: '100%',
      minHeight: 30,
      backgroundColor: 'transparent',
      paddingLeft: 20,
      paddingRight: 20,
      paddingTop: 10,
      paddingBottom: 10,
    },
  })

  if (boxed) {
    return (
      <View style={[styles.infoBlock, styles.shadow]} {...others}>
        {children}
      </View>
    )
  }

  return (
    <View style={styles.outBoxed} {...others}>
      {children}
    </View>
  )
}

export default InfoBlock
