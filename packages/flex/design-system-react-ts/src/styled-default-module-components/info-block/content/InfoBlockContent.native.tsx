import React from 'react'
import { StyleSheet } from 'react-native'
import { InfoBlockContentProps } from './InfoBlockContentProps'
import { View } from '../../view'

/**
 * Info Block Content
 * @param children {ReactNode} Children content
 */
const InfoBlockContent = ({ children, ...others }: InfoBlockContentProps): React.JSX.Element => {
  const styles = StyleSheet.create({
    infoBlock: {
      width: '100%',
      justifyContent: 'center',
      alignContent: 'center',
      paddingBottom: 10,
    },
  })

  return (
    <View style={styles.infoBlock} {...others}>
      {children}
    </View>
  )
}

export default InfoBlockContent
