// @ts-nocheck

'use server'

import React from 'react'
import classNames from 'classnames'
import { is, validate } from '../../services/index.js'
import { camelCase } from 'lodash'
import { TagProps } from './TagProps.js'

// ///////////////////////////////////////////////////////////////////////////
// /!\ When typed-scss-modules --exportType default
import { default as styles, type Styles } from '@flex-design-system/framework'
// import styles from 'flex-design-system-framework/main/all.module.scss'
// import { type Styles } from '@flex-design-system/framework/main/all.module.scss'
// ///////////////////////////////////////////////////////////////////////////

/**
 * Tag Component
 * @param children {ReactNode} Add childrens for tag
 * @param variant {TagVariant} Available tag variants
 * @param deletable {boolean} Adding delete icon
 * @param inverted {boolean} Inverted tag
 * @param onClick {Function} OnClick Event
 * @param className {string} Additionnal CSS Classes
 * @param hovered {boolean} Hover mode
 **/
const Tag = async ({
  children,
  className,
  classList,
  variant,
  hovered,
  deletable,
  onClick,
  onMouseEnter,
  onMouseLeave,
  inverted,
  ...others
}: TagProps): Promise<React.JSX.Element> => {
  const [display, setDisplay] = React.useState<boolean>(deletable || false)
  const [isHovered, setIsHovered] = React.useState<boolean>(hovered ?? false)
  const classes = classNames(
    styles.tag,
    deletable && styles.isHidden,
    variant && styles[camelCase(is(`${variant}`)) as keyof Styles],
    inverted && styles.isInverted,
    isHovered && styles[camelCase(is('hovered')) as keyof Styles],
    className,
    validate(classList),
  )

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onClickHandle = (e: any) => {
    setDisplay(!display)
    if (onClick) {
      onClick(e)
    }
  }
  const onnMouseEnterHandle = (e: React.SyntheticEvent) => {
    setIsHovered(true)
    if (onMouseEnter) {
      onMouseEnter(e)
    }
  }

  const onMouseLeaveHandle = (e: React.SyntheticEvent) => {
    setIsHovered(false)
    if (onMouseLeave) {
      onMouseLeave(e)
    }
  }

  const deleteClasses = classNames(
    styles.tags,
    variant && styles[camelCase(is(`${variant}`)) as keyof Styles],
    deletable && [styles.hasAddons, is('delete')],
    inverted && styles.isInverted,
    isHovered && styles[camelCase(is('hovered')) as keyof Styles],
    className,
    validate(classList),
  )

  React.useEffect(() => {
    setDisplay(deletable || false)
  }, [deletable])

  React.useEffect(() => {
    setIsHovered(hovered ?? false)
  }, [hovered])

  // Deletable tag
  if (deletable && display) {
    return (
      <div className={deleteClasses} onMouseEnter={onnMouseEnterHandle} onMouseLeave={onMouseLeaveHandle}>
        <span className={classNames(styles.tag)}>{children}</span>
        <button onClick={onClickHandle} className={classNames(styles.tag)} />
      </div>
    )
  }

  // Default tag
  return (
    <span className={classes} onClick={onClick && onClick} onMouseEnter={onnMouseEnterHandle} onMouseLeave={onMouseLeaveHandle} {...others}>
      {children}
    </span>
  )
}

export default Tag
