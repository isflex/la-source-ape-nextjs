import React, { useState, useEffect } from 'react'
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native'
import { RadioProps } from './RadioProps'
import { nanoid } from 'nanoid'

/**
 * Radio Native Component
 * @param checked {boolean} Checked Checkbox
 * @param className {string} Additionnal CSS Classes
 * @param disabled {boolean} Disabled
 * @param readOnly {boolean} readonly Checkbox
 * @param id {string} Id for button, by default id is generate
 * @param label {string} Label for Checkbox
 * @param labelClassName {string} addtionnial CSS Classes for label
 * @param onClick {ClickEvent}
 * @param onChange {ChangeEvent}
 * @param name {string} Name for checkbox
 * @param value {string} Value for checkbox
 * @param inverted {boolean} Inveted Checkbox color
 */
const Radio = ({
  id = nanoid(),
  checked,
  name,
  onClick,
  onChange,
  disabled,
  readonly,
  label,
  inverted,
  value,
}: RadioProps): Promise<React.JSX.Element> => {
  const [_checked, setChecked] = useState<string>(checked || '')

  useEffect(() => {
    setChecked(checked || '')
  }, [checked])

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'row',
      paddingBottom: 5,
    },
    radio: {
      flexDirection: 'row',
      alignItems: 'center',
      borderColor: !inverted ? '#9B9B9B' : '#fff',
      borderWidth: 1,
      width: 19,
      height: 19,
      borderRadius: 10,
      marginRight: 10,
    },
    icon: {
      position: 'absolute',
      left: 2,
      borderRadius: 30,
      width: 13,
      height: 13,
      backgroundColor: !inverted ? '#009dcc' : '#fff',
    },
    label: {
      color: (inverted && '#fff') || '#333',
    },
  })

  const handleClick = (value: string) => {
    if (!readonly) {
      setChecked(value)
      if (onClick) {
        onClick({
          radioId: id,
          radioValue: value,
          radioName: name || '',
          radioChecked: !_checked,
        })
      }
      if (onChange) {
        onChange({
          radioId: id,
          radioValue: value,
          radioName: name || '',
          radioChecked: !_checked,
        })
      }
    }
  }

  return (
    <TouchableOpacity style={styles.container} onPress={() => handleClick(value || '')}>
      <TouchableOpacity style={styles.radio} disabled={disabled} testID={id} onPress={() => handleClick(value || '')}>
        {_checked === value && <View style={styles.icon} />}
      </TouchableOpacity>
      {<Text style={styles.label}>{label}</Text>}
    </TouchableOpacity>
  )
}

export default Radio
