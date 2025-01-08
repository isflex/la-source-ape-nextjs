'use client'

import React from 'react'
import classNames from 'classnames'
import { nanoid } from 'nanoid'
import { validate } from '../../services/index.js'
import { Text } from '../text/index.js'
import { TextareaProps } from './TextareaProps.js'

// ///////////////////////////////////////////////////////////////////////////
// /!\ When typed-scss-modules --exportType default
import { default as styles } from '@flex-design-system/framework'
// import { default as styles, type Styles } from '@flex-design-system/framework'
// import styles from 'flex-design-system-framework/main/all.module.scss'
// import { type Styles } from '@flex-design-system/framework/main/all.module.scss'
// ///////////////////////////////////////////////////////////////////////////

/**
 * Textarea Component
 * @param disabled {boolean} Disabled textarea
 * @param onChange {Function} OnChange textarea Event
 * @param placeholder {string} Placeholder textarea
 * @param defaultValue {string} Default Value for textarea
 * @param help {string} Help for textarea
 * @param ref Pass a ref for textarea
 * @param id {string} textarea id
 * - -------------------------- WEB PROPERTIES -------------------------------
 * @param className {string} Additionnal CSS Classes
 * @param hovered {boolean} Hover mode
 * @param focused {boolean} Fucus mode
 * - -------------------------- NATIVE PROPERTIES -------------------------------
 * @param keyboardStyle {InputKeyboardAppearance} Custom appearance for keyboard
 * @param autoCapitalize {InputAutoCapitalize} Capitalize => NONE | SENTENCES | WORDS | CHARS
 * @param autoCorrect {boolean} Auto correct sentence
 * @param autoCompleteType {InputAutoCompleteType} Auto complete input type
 * @param textContentType {InputTextContentType} Give the keyboard and the system information
 * @param keyboardType {InputKeyboardType} Keybaord type
 */
const Textarea = ({
  className,
  classList,
  disabled,
  onChange,
  focused,
  placeholder,
  defaultValue,
  hovered,
  name,
  help,
  ref,
  id,
  ...others
}: TextareaProps): React.JSX.Element => {
  const [value, setValue] = React.useState(defaultValue || '')

  React.useEffect(() => {
    setValue(defaultValue || '')
  }, [defaultValue])

  const wrapperClasses = classNames(styles.field, className, validate(classList))

  const controlClasses = classNames(styles.control, styles.hasDynamicPlaceholder, {
    [styles.isDisabled]: disabled,
  })

  const classes = classNames(styles.textarea, hovered && !focused && styles.isHovered, focused && !hovered && styles.isFocused)

  const idGenerated = nanoid()

  return (
    <div className={wrapperClasses}>
      <div className={controlClasses}>
        <textarea
          {...others}
          className={classes}
          value={value}
          name={name}
          ref={ref}
          id={id || idGenerated}
          onChange={(e) => {
            setValue(e.target.value)
            if (onChange) {
              onChange({
                textareaName: e.target.name,
                textareaValue: e.target.value,
              })
            }
          }}
          placeholder={placeholder}
        />
        <label htmlFor={id || idGenerated}>{placeholder}</label>
      </div>
      {help && <Text className={styles.help}>{help}</Text>}
    </div>
  )
}

export default Textarea
