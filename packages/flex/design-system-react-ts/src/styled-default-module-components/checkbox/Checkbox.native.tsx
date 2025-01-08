import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, TouchableOpacity } from 'react-native'
// import { useFonts } from 'expo-font'
import { createIconSetFromFontello } from 'react-native-vector-icons'
import icoMoonConfig from '../../assets/fonts/icons/selection.json'
import { IconName } from '../icon'
import { CheckboxProps } from './CheckboxProps'
import { nanoid } from 'nanoid'

const CustomIcon = createIconSetFromFontello(icoMoonConfig)

/**
 * Checkbox Native Component
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
const Checkbox = ({
  id = nanoid(),
  checked,
  name,
  onClick,
  onChange,
  disabled,
  readonly,
  label,
  inverted,
}: CheckboxProps): React.JSX.Element => {
  const [_checked, setChecked] = useState(checked || false)
  // const [fontsLoaded] = useFonts({
  //   trilogyicons: require('../../assets/fonts/icons/trilogyicons.ttf'),
  // })
  useEffect(() => {
    setChecked(checked || false)
  }, [checked])

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'row',
    },
    checkBox: {
      flexDirection: 'row',
      alignItems: 'center',
      borderColor: !inverted ? '#9B9B9B' : '#fff',
      borderWidth: 1,
      width: 19,
      height: 19,
      borderRadius: 4,
      marginRight: 10,
    },
    icon: {},
    label: {
      color: (inverted && '#fff') || '#333',
    },
  })

  const handleClick = () => {
    if (!readonly) {
      setChecked(!_checked)
      if (onClick) {
        onClick({
          checkboxId: id,
          checkboxValue: '',
          checkboxName: name || '',
          checkboxChecked: !_checked,
        })
      }
      if (onChange) {
        onChange({
          checkboxId: id,
          checkboxValue: '',
          checkboxName: name || '',
          checkboxChecked: !_checked,
        })
      }
    }
  }

  return (
    <TouchableOpacity style={styles.container} onPress={() => handleClick()}>
      <TouchableOpacity style={styles.checkBox} disabled={disabled} testID={id} onPress={() => handleClick()}>
        {_checked && (
          <CustomIcon
            style={styles.icon}
            size={17}
            color={!inverted ? '#009dcc' : '#fff'}
            name={IconName.UI_CHECK_R.replace('tri-', '').replace('ui-', '')}
          />
        )}
      </TouchableOpacity>
      {label && <Text style={styles.label}>{label}</Text>}
    </TouchableOpacity>
  )
}

export default Checkbox
