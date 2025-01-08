import React from 'react'
import { StyleSheet } from 'react-native'
import { StepperProps } from './StepperProps'
import { View } from '../view'

/**
 * Stepper Component
 * @param centered Center the stepper
 */
const Stepper = ({ children, centered, ...others }: StepperProps): React.JSX.Element => {
  const styles = StyleSheet.create({
    stepper: {
      flexDirection: 'row',
      alignSelf: centered ? 'center' : 'flex-start',
    },
    separator: {
      width: 30,
      height: 5,
      backgroundColor: '#25465f',
    },
  })

  return (
    <View style={styles.stepper} {...others}>
      {children}
    </View>
  )
}

export default Stepper
