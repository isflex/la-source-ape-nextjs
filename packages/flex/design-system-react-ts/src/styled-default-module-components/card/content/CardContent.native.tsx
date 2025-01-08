import React from 'react'
import { StyleSheet, Text } from 'react-native'
import { CardContentProps } from './CardContentProps'
import { View } from '../../view'
import { Title, TitleLevel } from '../../title'
import { Button } from '../../button'

/**
 * Card Content Component
 * @param children {ReacNode} Card Content Children
 * @param titleSup {string} Add a sup title
 * @param title {string} Add a title
 * @param buttonText {string} if textButton, it will add a Button with content text
 * @param buttonVariant {VariantState} Add variant for Button - Default is primary
 * @param buttonClick {Function} Click event for Button
 * @param text {string} Content text of Card
 */
const CardContent = ({
  titleSup,
  title,
  text,
  buttonText,
  buttonClick,
  buttonVariant,
  ...others
}: CardContentProps): React.JSX.Element => {
  const styles = StyleSheet.create({
    card: {
      width: '100%',
      padding: 10,
      minHeight: 10,
    },
    text: {
      color: '#25465f',
      fontSize: 12,
    },
  })

  return (
    <View style={styles.card} {...others}>
      {titleSup && <Title level={TitleLevel.LEVEL7}>{titleSup}</Title>}
      {title && <Title level={TitleLevel.LEVEL6}>{title}</Title>}
      {text && (
        <>
          <View style={{ marginBottom: 6 }} />
          <Text style={styles.text}>{text}</Text>
        </>
      )}
      {buttonText && (
        <>
          <View style={{ marginBottom: 10 }} />
          <Button variant={buttonVariant} onClick={buttonClick}>
            {buttonText}
          </Button>
        </>
      )}
    </View>
  )
}

export default CardContent
