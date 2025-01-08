'use client'

import React from 'react'
import classNames from 'classnames'
import { nanoid } from 'nanoid'
// import { nanoid as nodeNanoid } from 'nanoid'
// import { nanoid as browserNanoid } from 'nanoid/index.browser'
import { is, validate } from '../../services/index.js'
import { camelCase } from 'lodash'
import { Icon, IconName, IconSize } from '../icon/index.js'
import { Text } from '../text/index.js'
import { InputStatus } from './InputEnum.js'
import { InputProps, InputWebEvents } from './InputProps.js'

// ///////////////////////////////////////////////////////////////////////////
// /!\ When typed-scss-modules --exportType default
import { default as styles, type Styles } from '@flex-design-system/framework'
// import styles from 'flex-design-system-framework/main/all.module.scss'
// import { type Styles } from '@flex-design-system/framework/main/all.module.scss'
// ///////////////////////////////////////////////////////////////////////////

interface InputProp extends InputProps, InputWebEvents {}

/**
 * Input Component
 * @param disabled {boolean} Disabled input
 * @param onChange {Function} OnChange Input Event
 * @param placeholder {string} Placeholder Input
 * @param type {InputType} Type for input
 * @param defaultValue {string} Default Value for Input
 * @param value {string} Value for Input
 * @param loading {boolean} Loading input
 * @param hovered {boolean} Hover mode
 * @param focused {boolean} Fucus mode
 * @param hasIcon {boolean} Adding if you want icon - Default icon is defined by status
 * @param customIcon {IconName} Adding if you want custom icon
 * @param status {InputStatus} Input with status - (SUCCESS|WARNING|DANGER)
 * @param help {string} Help for input
 * @param search {boolean} define if input is a search type
 * @param ref Pass a ref for input
 * @param id {string} Id for input, by default id is generate
 * - -------------------------- WEB PROPERTIES -------------------------------
 * @param className {string} Additionnal CSS Classes
 * @param onFocus {Function} OnFucus Input Event
 * @param iconClassname {string} Additional icon classes
 * - -------------------------- NATIVE PROPERTIES -------------------------------
 * @param keyboardStyle {InputKeyboardAppearance} Custom appearance for keyboard
 * @param autoCapitalize {InputAutoCapitalize} Capitalize => NONE | SENTENCES | WORDS | CHARS
 * @param autoCorrect {boolean} Auto correct sentence
 * @param autoCompleteType {InputAutoCompleteType} Auto complete input type
 * @param textContentType {InputTextContentType} Give the keyboard and the system information
 * @param keyboardType {InputKeyboardType} Keyboard type
 * @param forceControl {boolean} Force the control of the input value
 */
const Input = ({
  forceControl,
  className,
  classList,
  disabled,
  onChange,
  onKeyPress,
  onKeyUp,
  onIconClick,
  onClick,
  name,
  placeholder,
  type,
  defaultValue,
  value,
  loading,
  hovered,
  focused,
  hasIcon,
  customIcon,
  status,
  help,
  iconClassname,
  search = false,
  ref,
  id,
  ...others
}: InputProp): React.JSX.Element => {
  const [_value, setValue] = React.useState<string>(defaultValue ?? '')
  const [isHovered, setIsHovered] = React.useState<boolean>(hovered ?? false)
  const [isFocused, setIsFocused] = React.useState<boolean>(focused ?? false)

  React.useEffect(() => {
    setValue(value ?? defaultValue ?? '')
  }, [value, defaultValue])

  React.useEffect(() => {
    setIsHovered(hovered ?? false)
  }, [hovered])

  React.useEffect(() => {
    setIsFocused(focused ?? false)
  }, [focused])

  const inputIcon = new Map()
  inputIcon.set(InputStatus.SUCCESS, IconName.UI_CHECK_CIRCLE)
  inputIcon.set(InputStatus.WARNING, IconName.UI_EXCLAMATION_CIRCLE)
  inputIcon.set(InputStatus.DANGER, IconName.UI_EXCLAMATION_CIRCLE)

  const wrapperClasses = classNames(styles.field, className, validate(classList))

  const controlClasses = classNames(styles.control, !search && styles.hasDynamicPlaceholder, {
    [styles.hasIconsRight]: hasIcon ?? customIcon,
    [styles.isDisabled]: disabled,
  })

  const classes = classNames(
    styles.input,
    // status && is(status),
    status && styles[camelCase(is(status)) as keyof Styles],
    isHovered && !isFocused && styles.isHovered,
    isFocused && !isHovered && styles.isFocused,
  )

  const helpClasses = classNames(
    styles.help,
    // status && is(status),
    status && styles[camelCase(is(status)) as keyof Styles],
  )

  const idGenerated = nanoid()
  // const idGenerated = typeof window === 'undefined' ? nodeNanoid() : browserNanoid()

  return (
    <div className={wrapperClasses}>
      <div className={controlClasses}>
        <input
          {...others}
          type={type}
          id={id || idGenerated}
          className={classes}
          value={_value}
          defaultValue={defaultValue}
          name={name}
          ref={ref}
          onClick={(e: React.MouseEvent<Element>) => {
            const target = e.target as HTMLFormElement
            if (onClick) {
              onClick({
                inputName: target.name,
                inputValue: target.value,
              })
            }
          }}
          onKeyUp={(e: React.KeyboardEvent) => {
            const target = e.target as HTMLFormElement
            if (onKeyUp) {
              onKeyUp({
                inputName: target.name,
                inputValue: target.value,
                inputKeyCode: e.keyCode,
              })
            }
          }}
          onKeyPress={(e: React.KeyboardEvent) => {
            const target = e.target as HTMLFormElement
            if (onKeyPress) {
              onKeyPress({
                inputName: target.name,
                inputValue: target.value,
                inputKeyCode: e.keyCode,
              })
            }
          }}
          onChange={(e) => {
            // eslint-disable-next-line no-console
            if (!forceControl) setValue(e.target.value)
            if (onChange) {
              onChange({
                inputName: e.target.name,
                inputValue: e.target.value,
              })
            }
          }}
          onFocus={() => {
            setIsFocused(true)
          }}
          onBlur={() => setIsFocused(false)}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          placeholder={placeholder}
        />
        {!search && <label htmlFor={id || idGenerated}>{placeholder}</label>}
        {hasIcon && status && !customIcon && !loading && (
          <div
            onClick={() => {
              if (onIconClick) {
                onIconClick({ inputName: name ?? '', inputValue: _value })
              }
            }}
          >
            <Icon className={iconClassname} name={inputIcon.get(status)} size={IconSize.SMALL} />
          </div>
        )}
        {customIcon && !status && !loading && (
          <div
            onClick={() => {
              if (onIconClick) {
                onIconClick({ inputName: name ?? '', inputValue: _value })
              }
            }}
          >
            <Icon className={iconClassname} name={customIcon} size={IconSize.SMALL} />
          </div>
        )}
        {customIcon && status && !loading && (
          <div
            onClick={() => {
              if (onIconClick) {
                onIconClick({ inputName: name ?? '', inputValue: _value })
              }
            }}
          >
            {' '}
            <Icon className={iconClassname} name={customIcon} size={IconSize.SMALL} />
          </div>
        )}
        {search && !status && !loading && (
          <div
            onClick={() => {
              if (onIconClick) {
                onIconClick({ inputName: name ?? '', inputValue: _value })
              }
            }}
          >
            <Icon className={iconClassname} name={IconName.UI_SEARCH} size={IconSize.SMALL} />
          </div>
        )}
        {loading && <span className={styles.isSearching} />}
      </div>
      {help && <Text className={helpClasses}>{help}</Text>}
    </div>
  )
}

export default Input
