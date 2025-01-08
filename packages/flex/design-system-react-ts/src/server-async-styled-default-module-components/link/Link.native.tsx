import React from 'react'
import { StyleSheet, Text, Linking, Animated } from 'react-native'
import { LinkProps } from './LinkProps'
import { View } from '../view'

/**
 * Link Component
 * @param fixed {boolean} Static link with no animation
 * @param plain {boolean} Link without underline
 * @param to {string} Url to open
 * @param tertiary {boolean} Tertiary variant
 * @param title {string} Title attribute
 */
const Link = ({ children, to, plain, tertiary, title, ...others }: LinkProps): Promise<React.JSX.Element> => {
  const color = '#109db9'
  const tertiaryColor = '#25465f'

  const styles = StyleSheet.create({
    container: {
      alignSelf: 'baseline',
      minWidth: 2,
    },
    link: {
      color: tertiary ? tertiaryColor : color,
    },
    underline: {
      backgroundColor: tertiary ? tertiaryColor : color,
      minWidth: 10,
      height: 2,
      marginTop: 2,
    },
  })

  return (
    <View style={styles.container}>
      <Text
        accessibilityLabel={title || ''}
        onPress={() => Linking.openURL(to || '')}
        style={[styles.link]}
        {...others}
      >
        {children}
      </Text>
      <Animated.View style={!plain && styles.underline} />
    </View>
  )
}

export default Link
