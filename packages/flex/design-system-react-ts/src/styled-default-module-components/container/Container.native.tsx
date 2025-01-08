import React from 'react'
import { StyleSheet } from 'react-native'
import { ContainerProps } from './ContainerProps'
import { View } from '../view'

/**
 * Container Native Component
 * @param fluid {boolean} Make the container usable across the width of your section
 */
const Container = ({ children, fluid, ...others }: ContainerProps): React.JSX.Element => {
  const styles = StyleSheet.create({
    container: {
      width: '100%',
      marginLeft: 15,
      marginRight: 15,
    },
    fluid: {
      alignSelf: 'stretch',
      maxWidth: 'auto',
      width: 'auto',
    },
  })

  return (
    <View style={!fluid ? styles.container : styles.fluid} {...others}>
      {children}
    </View>
  )
}

export default Container
