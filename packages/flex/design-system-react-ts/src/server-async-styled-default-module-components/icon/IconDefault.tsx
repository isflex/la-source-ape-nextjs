// @ts-nocheck

'use server'

import React from 'react'
import classNames from 'classnames'
import { is, validate } from '../../services/index.js'
import { camelCase } from 'lodash'
import { IconProps } from './IconProps.js'
import StatusIcon from './status/index.js'
import CircleIcon from './circle/index.js'
import TextIcon from './text/index.js'
// ///////////////////////////////////////////////////////////////////////////
// /!\ When typed-scss-modules --exportType default
import { default as styles, type Styles } from '@flex-design-system/framework'
// import styles from 'flex-design-system-framework/main/all.module.scss'
// import { type Styles } from '@flex-design-system/framework/main/all.module.scss'
// ///////////////////////////////////////////////////////////////////////////

/**
 * Icon Component
 * @param size Size of Icon
 * @param name IconName
 * @param badgeContent {string} Display badge with icon
 * @param status SUCCESS|DANGER If CircleIcon or not
 * @param circled true-false if CircleIcon
 * @param content If TextIcon use it for text
 * @param position UP|DOWN|LEFT|RIGHT
 * @param stacked {boolean} Stacked icon
 * @param badgeContent {string} Icon with bage content
 * @param statusPosition {IconStatusPosition} Position for icon with status (TOP|BOTTOM)
 * @param stretched {boolean} Stretched icon
 * - -------------------------- WEB PROPERTIES -------------------------------
 * @param className Additionnal css classes
 * @param classList {array} Additionnal css classes
 * @param markup {TextIconMarkup} Available markup for Icon DIV|P|SPAN|A
 * @param color {IconColor} Custom Icon Color
 * @param onClick {Function} onClick Event Icon
 */

const Icon = async ({
  className,
  classList,
  textClassName,
  size,
  name,
  status,
  circled,
  content,
  position,
  markup,
  stacked,
  badgeContent,
  statusPosition,
  stretched,
  color,
  onClick,
  ...others
}: IconProps): Promise<React.JSX.Element> => {
  // }: IconProps): React.JSX.Element | React.DetailedHTMLProps<React.HTMLAttributes<HTMLSpanElement>, HTMLSpanElement> => {
  const classes = classNames(
    styles.icon,
    stretched && styles.isStretched,
    size && styles[camelCase(is(size)) as keyof Styles],
    stacked && styles.isStacked,
    color && styles[camelCase(is(`${color}`)) as keyof Styles],
    className,
    validate(classList),
  )

  const iconName = styles[camelCase(name) as keyof Styles]

  // circled icons
  if (circled || (circled && status)) {
    return <CircleIcon onClick={onClick && onClick} className={className} name={name} status={status} size={size} {...others} />
  }

  // status icons
  if (status) {
    return (
      <StatusIcon
        onClick={onClick && onClick}
        statusPosition={statusPosition}
        className={className}
        name={name}
        size={size}
        status={status}
        {...others}
      />
    )
  }

  // Text icon
  if (content && !badgeContent) {
    return (
      <TextIcon
        onClick={onClick && onClick}
        className={className}
        name={name}
        content={content}
        position={position}
        textClassName={textClassName}
        size={size}
        markup={markup}
        status={status}
        {...others}
      />
    )
  }

  // Icon with badge + badge content
  if (badgeContent) {
    return (
      <>
        <span onClick={onClick && onClick} className={classes} {...others}>
          <i className={iconName} aria-hidden='true' />
          <span className={classNames(styles.badge, styles.isUp)}>{badgeContent}</span>
        </span>
        {content && <span className={textClassName}>{content}</span>}
      </>
    )
  }

  // Stretched icon
  if (stretched) {
    return (
      <span onClick={onClick && onClick} className={classes} {...others}>
        <i className={iconName} aria-hidden='true' />
      </span>
    )
  }

  // Custom Colored Icon
  if (color) {
    return (
      <span onClick={onClick && onClick} className={classes} {...others}>
        <i className={iconName} aria-hidden='true' />
      </span>
    )
  }

  // Static default Icon
  return (
    <span onClick={onClick && onClick} className={classes} {...others}>
      <i className={iconName} aria-hidden='true' />
    </span>
  )
}

export default Icon
