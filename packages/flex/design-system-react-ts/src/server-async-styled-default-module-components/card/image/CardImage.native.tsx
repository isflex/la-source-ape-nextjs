import React from 'react'
import { StyleSheet, Image } from 'react-native'
import { CardImageProps } from './CardImageProps'

/**
 * Card Image Component
 * @param src Image source
 * @param size Image Card size on horizontal align
 * @param alt Alt attribute
 */
const CardImage = ({ src, size, alt, ...others }: CardImageProps): Promise<React.JSX.Element> => {
  const styles = StyleSheet.create({
    cardImage: {
      width: size ? `${size}0%` : '100%',
      minHeight: 150,
      maxHeight: 350,
      alignSelf: 'auto',
      borderTopLeftRadius: 3,
      borderTopRightRadius: 3,
    },
  })

  return (
    <Image
      accessibilityLabel={alt}
      style={styles.cardImage}
      source={{
        uri: src,
      }}
      {...others}
    />
  )
}

export default CardImage
