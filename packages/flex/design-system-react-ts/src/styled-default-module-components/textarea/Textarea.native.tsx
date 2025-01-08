import React, { useState } from 'react'
import { View } from '../view'
import { TextInput, StyleSheet, Text } from 'react-native'
import { TextareaProps } from './TextareaProps'
import {
  InputKeyboardAppearance,
  InputAutoCapitalize,
  InputTextContentType,
  InputKeyboardType,
} from '../input/InputEnum'

type TextareaNativeProps = TextareaProps

/**
 * Textarea Native Component
 * @param disabled {boolean} Disabled input
 * @param onChange {Function} OnChange Input Event
 * @param placeholder {string} Placeholder Input
 * @param defaultValue {string} Default Value for Input
 * @param help {string} Help for input
 * @param ref Pass a ref for textarea
 * @param keyboardStyle {InputKeyboardAppearance} Custom appearance for keyboard
 * @param autoCapitalize {InputAutoCapitalize} Capitalize => NONE | SENTENCES | WORDS | CHARS
 * @param autoCorrect {boolean} Auto correct sentence
 * @param autoCompleteType {InputAutoCompleteType} Auto complete input type
 * @param textContentType {InputTextContentType} Give the keyboard and the system information
 * @param keyboardType {InputKeyboardType} Keybaord type
 */
const Textarea = ({
  defaultValue,
  name,
  onChange,
  disabled,
  help,
  placeholder,
  ref,
  keyboardStyle,
  autoCapitalize,
  autoCorrect,
  autoCompleteType,
  textContentType,
  keyboardType,
  ...others
}: TextareaNativeProps): React.JSX.Element => {
  const [value, setValue] = useState<string>(defaultValue || '')

  const styles = StyleSheet.create({
    textarea: {
      borderWidth: 1,
      borderRadius: 3,
      borderColor: '#333',
      height: 100,
      justifyContent: 'flex-start',
      paddingLeft: 10,
      paddingRight: 10,
      paddingTop: 6,
      textAlignVertical: 'top',
    },
    help: {
      fontSize: 12,
      color: '#333',
      paddingLeft: 4,
      paddingTop: 2,
    },
  })

  return (
    <View>
      <TextInput
        value={value}
        editable={!disabled}
        multiline={true}
        ref={ref}
        keyboardAppearance={keyboardStyle || InputKeyboardAppearance.DEFAULT}
        autoCapitalize={autoCapitalize || InputAutoCapitalize.NONE}
        autoCorrect={autoCorrect || false}
        autoComplete={autoCompleteType}
        textContentType={textContentType || InputTextContentType.NONE}
        keyboardType={keyboardType || InputKeyboardType.DEFAULT}
        onChangeText={(text) => {
          setValue(text)
          if (onChange) {
            onChange({
              textareaName: (name && name) || '',
              textareaValue: text,
            })
          }
        }}
        placeholder={placeholder}
        style={styles.textarea}
        {...others}
      />
      {help && <Text style={styles.help}>{help}</Text>}
    </View>
  )
}

export default Textarea
