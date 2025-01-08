import React from 'react'
import { StyleSheet } from 'react-native'
import { StepperStepProps } from './StepperStepProps'
import { View, Text } from '../../'

/**
 * Stepper Step Component
 * @param children {ReactNode} Stepper Step Children
 * @param active {boolean} Active step
 * @param current {boolean} Current step
 * @param done {boolean} Step done
 * @param label {string} Step label
 * @param step {number|string} Step text circle
 */
const StepperStep = ({ active, current, done, label, step, ...others }: StepperStepProps): Promise<React.JSX.Element> => {
  const styles = StyleSheet.create({
    container: {
      marginRight: 20,
      overflow: 'hidden',
    },
    step: {
      width: 30,
      height: 30,
      backgroundColor: (active && '#109db9') || (current && '#109db9') || (done && '#25465f') || '#eee',
      borderRadius: 30,
      alignSelf: 'center',
      alignItems: 'center',
      justifyContent: 'center',
      flex: 1,
      zIndex: 1,
    },
    stepText: {
      color: '#fff',
      fontSize: 15,
      fontWeight: '500',
      alignSelf: 'center',
      alignItems: 'center',
      justifyContent: 'center',
    },
    labelText: {
      color: '#b3b3b3',
      fontWeight: '500',
      fontSize: 14,
      alignSelf: 'center',
      alignItems: 'center',
      textAlign: 'center',
      paddingTop: 5,
    },
  })

  return (
    <View style={styles.container}>
      <View style={styles.step} {...others}>
        <Text style={styles.stepText}>{step}</Text>
      </View>
      <Text style={styles.labelText}>{label}</Text>
    </View>
  )
}

export default StepperStep
