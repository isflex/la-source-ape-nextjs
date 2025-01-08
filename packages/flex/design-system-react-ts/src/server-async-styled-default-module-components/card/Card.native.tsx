import React from 'react'
import { StyleSheet } from 'react-native'
import { CardProps } from './CardProps'
import { View } from '../view'

/**
 * Card Component
 * @param flat Adding border for Card content
 * @param horizontal Horizontal Card orientation
 * @param floating Floating card
 * @param size Image Card size on horizontal align
 */
const Card = ({ children, flat, horizontal, floating, ...others }: CardProps): Promise<React.JSX.Element> => {
  const borderColor = '#ccc'
  const backgroundColor = '#fff'

  const styles = StyleSheet.create({
    card: {
      width: '100%',
      height: 'auto',
      borderWidth: flat ? 1 : 0,
      borderColor: flat ? borderColor : 'transparent',
      borderRadius: 3,
      backgroundColor: backgroundColor,
    },
    horizontal: {
      flexDirection: 'row',
      maxWidth: '100%',
    },
    shadow: {
      shadowColor: 'rgba(0,0,0,.1)',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.8,
      shadowRadius: 2,
      elevation: 5,
    },
    imageHorizontal: {
      borderBottomLeftRadius: 3,
      borderTopLeftRadius: 3,
      borderTopRightRadius: 0,
      width: '50%',
      minHeight: 150,
      maxHeight: 350,
      alignSelf: 'auto',
    },
    contentHorizontal: {
      width: '50%',
      padding: 10,
      minHeight: 10,
    },
  })

  if (horizontal) {
    return (
      <View style={[styles.card, styles.horizontal, !floating && styles.shadow]} {...others}>
        {Array.isArray(children)
          ? children.map(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (child: any, index: number) =>
              (child &&
                  child.type.name === 'CardImage' &&
                  React.cloneElement(child, {
                    key: index,
                    style: [styles.imageHorizontal],
                  })) ||
                (child &&
                  child.type.name === 'CardContent' &&
                  React.cloneElement(child, {
                    key: index,
                    style: [styles.contentHorizontal],
                  })) ||
                child,
          )
          : children}
      </View>
    )
  }

  return (
    <View style={[styles.card, !floating && styles.shadow]} {...others}>
      {children}
    </View>
  )
}

export default Card
