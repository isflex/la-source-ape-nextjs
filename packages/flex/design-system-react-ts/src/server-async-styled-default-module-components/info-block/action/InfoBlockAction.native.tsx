import React from 'react'
import { StyleSheet } from 'react-native'
import { InfoBlockActionProps } from './InfoBlockActionProps'
import { View } from '../../view'

/**
 * Info Block Action
 * @param children {string} Button text content
 */
const InfoBlockAction = ({ children, ...others }: InfoBlockActionProps): Promise<React.JSX.Element> => {
  const styles = StyleSheet.create({
    action: {
      width: '50%',
      alignSelf: 'center',
      paddingTop: 5,
    },
  })

  return (
    <View style={styles.action} {...others}>
      {children}
    </View>
  )
}

export default InfoBlockAction
