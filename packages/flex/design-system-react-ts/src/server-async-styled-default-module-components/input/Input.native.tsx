import React, { useState, useEffect } from 'react'
import { View } from '../view'
import { TextInput, StyleSheet, Text, TouchableOpacity } from 'react-native'
import { createIconSetFromFontello } from 'react-native-vector-icons'
import icoMoonConfig from '../../assets/fonts/icons/selection.json'
import { InputProps, InputNativeEvents } from './InputProps'
import { AlertState } from '../../objects/facets/Alert'
import {
  InputStatus,
  InputType,
  InputKeyboardAppearance,
  InputAutoCapitalize,
  InputTextContentType,
  InputKeyboardType,
} from './InputEnum'
import { IconName } from '../icon'

const CustomIcon = createIconSetFromFontello(icoMoonConfig)
interface InputNativeProps extends InputProps, InputNativeEvents {}

/**
 * Input Native Component
 * @param disabled {boolean} Disabled input
 * @param onChange {Function} OnChange Input Event
 * @param placeholder {string} Placeholder Input
 * @param type {InputType} Type for input
 * @param defaultValue {string} Default Value for Input
 * @param status {InputStatus} Input with status - (SUCCESS|WARNING|DANGER)
 * @param help {string} Help for input
 * @param search {boolean} define if input is a search type
 * @param hasIcon {boolean} Input Has Icon, Precise IconName with customIcon
 * @param ref Pass a ref for input
 * @param customIcon {IconName} Adding if you want custom icon
 * @param keyboardStyle {InputKeyboardAppearance} Custom appearance for keyboard
 * @param autoCapitalize {InputAutoCapitalize} Capitalize => NONE | SENTENCES | WORDS | CHARS
 * @param autoCorrect {boolean} Auto correct sentence
 * @param autoCompleteType {InputAutoCompleteType} Auto complete input type
 * @param textContentType {InputTextContentType} Give the keyboard and the system information
 * @param keyboardType {InputKeyboardType} Keybaord type
 */
const Input = ({
  defaultValue,
  name,
  onChange,
  disabled,
  status,
  help,
  placeholder,
  type,
  hasIcon,
  customIcon,
  search,
  ref,
  keyboardStyle,
  autoCapitalize,
  autoCorrect,
  autoCompleteType,
  textContentType,
  keyboardType,
  ...others
}: InputNativeProps): Promise<React.JSX.Element> => {
  const [value, setValue] = useState<string>(defaultValue || '')

  useEffect(() => {
    setValue(defaultValue || '')
  }, [defaultValue])

  const inputIcon = new Map()
  inputIcon.set(InputStatus.SUCCESS, IconName.UI_CHECK_CIRCLE_S)
  inputIcon.set(InputStatus.WARNING, IconName.UI_EXCLAMATION_CIRCLE_S)
  inputIcon.set(InputStatus.DANGER, IconName.UI_EXCLAMATION_CIRCLE_S)

  const placeholderColor = '#B6B6B6'

  const styles = StyleSheet.create({
    input: {
      paddingLeft: 10,
      width: hasIcon && (status || customIcon) ? '85%' : '95%',
      minHeight: 40,
    },
    help: {
      fontSize: 12,
      color:
        (status && status === 'success' && AlertState.SUCCESS.getStyle()) ||
        (status && status === 'warning' && AlertState.WARNING.getStyle()) ||
        (status && status === 'danger' && AlertState.DANGER.getStyle()) ||
        '#333',
      paddingLeft: 4,
      paddingTop: 2,
    },
    inputWrapper: {
      flex: 1,
      justifyContent: 'center',
      alignSelf: 'stretch',
      backgroundColor: '#fff',
      borderWidth: 1,
      borderRadius: 3,
      borderColor:
        (status && status === 'success' && AlertState.SUCCESS.getStyle()) ||
        (status && status === 'warning' && AlertState.WARNING.getStyle()) ||
        (status && status === 'danger' && AlertState.DANGER.getStyle()) ||
        '#333',
      minHeight: 40,
    },
    inputIcon: {
      position: 'absolute',
      right: 10,
    },
  })

  return (
    <View>
      <View style={styles.inputWrapper}>
        <TextInput
          secureTextEntry={!!(type && type === InputType.PASSWORD)}
          value={value}
          editable={!disabled}
          ref={ref}
          autoCapitalize={autoCapitalize || InputAutoCapitalize.NONE}
          keyboardAppearance={keyboardStyle || InputKeyboardAppearance.DEFAULT}
          autoCorrect={autoCorrect || false}
          autoComplete={autoCompleteType}
          textContentType={textContentType || InputTextContentType.NONE}
          keyboardType={keyboardType || InputKeyboardType.DEFAULT}
          onChangeText={(text: string) => {
            setValue(text)
            if (onChange) {
              onChange({
                inputName: (name && name) || '',
                inputValue: text,
              })
            }
          }}
          placeholder={placeholder}
          placeholderTextColor={placeholderColor}
          style={styles.input}
          {...others}
        />
        {hasIcon && (status || customIcon) && (
          <CustomIcon
            style={styles.inputIcon}
            name={
              (customIcon && customIcon.replace('tri-', '').replace('ui-', '')) ||
              inputIcon.get(status).replace('tri-', '').replace('ui-', '')
            }
            size={20}
            color={
              (status && status === 'success' && AlertState.SUCCESS.getStyle()) ||
              (status && status === 'warning' && AlertState.WARNING.getStyle()) ||
              (status && status === 'danger' && AlertState.DANGER.getStyle()) ||
              '#333'
            }
          />
        )}
        {search && !status && (
          <TouchableOpacity style={styles.inputIcon} onPress={() => setValue('')}>
            <CustomIcon
              name={
                value
                  ? IconName.UI_TIMES.replace('tri-', '').replace('ui-', '')
                  : IconName.UI_SEARCH.replace('tri-', '').replace('ui-', '')
              }
              size={20}
              color={'#b3b3b3'}
            />
          </TouchableOpacity>
        )}
      </View>
      {help && <Text style={styles.help}>{help}</Text>}
    </View>
  )
}

export default Input
