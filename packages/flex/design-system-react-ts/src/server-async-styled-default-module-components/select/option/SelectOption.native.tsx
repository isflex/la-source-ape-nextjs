import React from 'react'
import { StyleSheet } from 'react-native'
import { Picker } from '@react-native-picker/picker'
import { SelectOptionProps } from './SelectOptionProps'
import { View } from '../../'

/**
 * Select Option Component
 * @param selected {boolean} Selected option
 * @param value {string} Select option value
 * @param label {string} Label value
 */
const SelectOption = ({ value, label, ...others }: SelectOptionProps): Promise<React.JSX.Element> => {
  const styles = StyleSheet.create({
    selectItem: {},
  })

  return (
    <View style={styles.selectItem}>
      <Picker.Item label={label || ''} value={value || ''} {...others} />
    </View>
  )
}

export default SelectOption
