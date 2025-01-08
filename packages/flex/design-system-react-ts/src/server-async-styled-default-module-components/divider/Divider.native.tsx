import React from 'react'
import { StyleSheet, Text } from 'react-native'
import { DividerProps } from './DividerProps'
import { View } from '../view'

/**
 * Divider Native Component
 * @param className {string} Additionnal CSS Classes
 * @param content {string} Add text content for Divider
 * @param unboxed {boolean} Full-width separator in another component
 * @param marginless {boolean} Marginless divider
 */
const Divider = ({ content, unboxed, marginless, ...others }: DividerProps): Promise<React.JSX.Element> => {
  const dividerColor = '#B3B3B3B3'

  const styles = StyleSheet.create({
    divider: {
      borderBottomColor: dividerColor,
      borderBottomWidth: 1,
      width: '100%',
      alignSelf: ((unboxed || marginless) && 'stretch') || 'auto',
    },
    dividerContent: {
      borderBottomColor: dividerColor,
      borderBottomWidth: 1,
      alignSelf: 'center',
      justifyContent: 'center',
      width: '41%',
    },
    container: {
      flexDirection: 'row',
      flex: 1,
      alignItems: 'center',
    },
    content: {
      width: 40,
      height: 40,
      backgroundColor: dividerColor,
      borderRadius: 30,
      justifyContent: 'center',
      margin: 10,
    },
    textContent: {
      textAlign: 'center',
      alignSelf: 'center',
      justifyContent: 'center',
      fontSize: 15,
      fontWeight: 'bold',
    },
  })

  if (content) {
    return (
      <View style={styles.container}>
        <View style={styles.dividerContent} {...others} />
        <View style={styles.content}>
          <Text style={styles.textContent}>{content}</Text>
        </View>
        <View style={styles.dividerContent} {...others} />
      </View>
    )
  }

  return <View style={styles.divider} {...others} />
}

export default Divider
