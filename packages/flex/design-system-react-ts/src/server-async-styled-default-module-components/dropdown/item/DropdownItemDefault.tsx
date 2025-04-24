'use server'

import React from 'react'
import classNames from 'classnames'
import { nanoid } from 'nanoid'
import { validate } from '../../../services/index.js'
// import { camelCase } from 'lodash'
import { DropdownItemWebProps } from './DropdownItemProps.js'
// import Radio from '../../radio/index.js'
import { Checkbox } from '../../checkbox/index.js'

// ///////////////////////////////////////////////////////////////////////////
// /!\ When typed-scss-modules --exportType default
import { default as styles, type Styles } from '@flex-design-system/framework'
// import { default as styles, type Styles } from '@flex-design-system/framework/main/all.module.scss'
// ///////////////////////////////////////////////////////////////////////////

/**
 * Dropdown Item Component - Working like radio component
 * @param id {string} By default random id generated
 * @param className {string} Additionnal CSS Classes
 * @param classList {array} Additionnal css classes
 * @param label {string} Dropdown item label
 * @param disabled {boolean} Disabled dropdown item
 * @param readonly {boolean} Readonly dropdown item
 * @param name {string} Dropdown Item name
 * @param value {string} Dropdown Item name
 */
const DropdownItem = async ({
  children,
  id,
  className,
  classList,
  label,
  disabled,
  readonly,
  name,
  value,
  checked,
  onClick,
  onChange,
  ...others
}: DropdownItemWebProps): Promise<React.ReactNode> => {
  const [_checked, setChecked] = React.useState<boolean>(checked || false)

  const classes = classNames(styles.dropdownItem, className, validate(classList))

  React.useEffect(() => {
    if (!readonly) {
      setChecked(checked || false)
    }
  }, [checked, readonly])

  const idGenerated = nanoid()

  if (!children) {
    return (
      <div className={classes} {...others}>
        <Checkbox
          id={id || idGenerated}
          label={label || ''}
          disabled={disabled}
          readonly={readonly}
          name={name}
          value={value}
          checked={readonly ? checked : _checked}
          onClick={(e) => {
            if (!readonly && e.checkboxChecked !== undefined) {
              setChecked(e.checkboxChecked)
            }
            if (onClick) {
              onClick({
                itemId: e.checkboxId,
                itemValue: e.checkboxValue,
                itemChecked: e.checkboxChecked,
              })
            }
            if (onChange) {
              onChange({
                itemId: e.checkboxId,
                itemValue: e.checkboxValue,
                itemChecked: e.checkboxChecked,
              })
            }
          }}
        />
      </div>
    )
  }

  return (
    <div className={classes} {...others}>
      {children}
    </div>
  )
}

export default DropdownItem
