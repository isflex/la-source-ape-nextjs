import React from 'react'
import { StyleSheet, Text } from 'react-native'
import { BadgeProps } from './BadgeProps'
import { View } from '../view'
import { BadgeTextDirection } from './BadgeEnum'

/**
 * Badge Native Component
 * @param children {ReactNode} If no content add children (Icon for example)
 * @param textContent {string} Content text for badge with text, if textContent props, it will display badge with text
 * @param content content {string|number} Badge content text
 * @param textDirection {BadgeTextDirection} Text direction for Badge (LEFT|RIGHT)
 */
const Badge = ({ children, textContent, content, direction, ...others }: BadgeProps): React.JSX.Element => {
  const badgeColor = '#109db9'
  const textColor = '#fff'

  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
    },
    badge: {
      alignSelf: 'baseline',
      minWidth: 20,
      height: 20,
      backgroundColor: badgeColor,
      borderRadius: 30,
      justifyContent: 'center',
      alignItems: 'center',
    },
    text: {
      color: textColor,
      fontSize: 10,
    },
    textContent: {
      fontSize: 15,
      marginRight: 5,
      marginLeft: 5,
    },
  })

  if (textContent) {
    return (
      <View style={styles.container}>
        {!direction && <Text style={styles.textContent}>{textContent}</Text>}
        {direction && direction === BadgeTextDirection.LEFT && <Text style={styles.textContent}>{textContent}</Text>}
        <View style={styles.badge}>
          <Text style={styles.text}>{content}</Text>
        </View>
        {direction && direction === BadgeTextDirection.RIGHT && <Text style={styles.textContent}>{textContent}</Text>}
      </View>
    )
  }

  return (
    <View>
      {content ? (
        <View style={styles.badge} {...others}>
          <Text style={styles.text}>{content}</Text>
        </View>
      ) : (
        <View style={styles.badge} {...others}>
          {children}
        </View>
      )}
    </View>
  )
}

export default Badge
