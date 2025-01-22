'use server'

import React from 'react'
import classNames from 'classnames'
import { IconProps } from './IconProps.js'
import StatusIcon from './status/index.js'
import CircleIcon from './circle/index.js'
import TextIcon from './text/index.js'
import { is } from '../../services/index.js'

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
 * @param markup {TextIconMarkup} Available markup for Icon DIV|P|SPAN|A
 * @param color {IconColor} Custom Icon Color
 * @param onClick {Function} onClick Event Icon
 */
const Icon = async ({
  className,
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
}: IconProps): Promise<React.AwaitedReactNode> => {
  // }: IconProps): React.JSX.Element | React.DetailedHTMLProps<React.HTMLAttributes<HTMLSpanElement>, HTMLSpanElement> => {
  const classes = classNames('icon', stretched && is('stretched'), size && is(size), stacked && is('stacked'), color && is(`${color}`), className)

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
          <i className={name} aria-hidden='true' />
          <span className={classNames('badge', is('up'))}>{badgeContent}</span>
        </span>
        {content && <span className={textClassName}>{content}</span>}
      </>
    )
  }

  // Stretched icon
  if (stretched) {
    return (
      <span onClick={onClick && onClick} className={classes} {...others}>
        <i className={name} aria-hidden='true' />
      </span>
    )
  }

  // Custom Colored Icon
  if (color) {
    return (
      <span onClick={onClick && onClick} className={classes} {...others}>
        <i className={name} aria-hidden='true' />
      </span>
    )
  }

  // Static default Icon
  return (
    <span onClick={onClick && onClick} className={classes} {...others}>
      <i className={name} aria-hidden='true' />
    </span>
  )
}

export default Icon
