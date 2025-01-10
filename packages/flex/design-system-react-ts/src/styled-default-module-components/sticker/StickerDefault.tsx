'use client'

import React from 'react'
import classNames from 'classnames'
import { is, validate } from '../../services/index.js'
import { camelCase } from 'lodash'
import { StickerProps } from './StickerProps.js'
import { StickerMarkup } from './StickerEnum.js'

// ///////////////////////////////////////////////////////////////////////////
// /!\ When typed-scss-modules --exportType default
import { default as styles, type Styles } from '@flex-design-system/framework'
// import { default as styles, type Styles } from '@flex-design-system/framework/main/all.module.scss'
// ///////////////////////////////////////////////////////////////////////////

/**
 * Sticker component
 * @param children {ReactNode} Sticker child
 * @param stretched {true|false} Stretched sticker
 * @param variant {AlertState} Sticker variant : primary|secondary
 * @param small {boolean} Small Sticker
 * @param alert {AlertState} Alert variant color for Sticker
 * @param inverted {boolean} Invert sticker color
 * - -------------------------- WEB PROPERTIES -------------------------------
 * @param markup {StickerMarkup} HTML element : p|span|div
 * @param hat {boolean} Hat Sticker
 * @param className {string} Additionnal css classes
 * @param classList {array} Additionnal css classes
 */
const Sticker = ({
  className,
  classList,
  children,
  stretched,
  variant,
  small,
  alert,
  hat,
  markup,
  inverted,
  ...others
}: StickerProps): React.JSX.Element => {
  const classes = classNames(
    styles.sticker,
    stretched && styles[camelCase(is('stretched')) as keyof Styles],
    variant && !alert && styles[camelCase(is(variant.getClassName())) as keyof Styles],
    alert && !variant && styles[camelCase(is(alert.getClassName())) as keyof Styles],
    small && styles[camelCase(is('small')) as keyof Styles],
    hat && styles[camelCase(is('hat')) as keyof Styles],
    inverted && styles[camelCase(is('inverted')) as keyof Styles],
    className,
    validate(classList),
  )

  const Tag = markup && (markup in StickerMarkup || Object.values(StickerMarkup).includes(markup)) ? markup : 'div'

  return (
    <Tag className={classes} {...others}>
      {children}
    </Tag>
  )
}

export default Sticker
