/* eslint-disable @typescript-eslint/no-unused-vars */

'use client'

import React from 'react'
import classNames from 'classnames'
import { validate } from '../../services/index.js'
import { BoxProps, BoxMarkup } from './BoxProps.js'

// ///////////////////////////////////////////////////////////////////////////
// /!\ When typed-scss-modules --exportType default
import { default as styles, type Styles } from '@flex-design-system/framework'
// import { default as styles, type Styles } from '@flex-design-system/framework/main/all.module.scss'
// ///////////////////////////////////////////////////////////////////////////

/**
 * Box Component
 * @param children {ReactNode} Box child
 * - -------------------------- WEB PROPERTIES -------------------------------
 * @param className {string} Additionnal css classes
 * @param classList {array} Additionnal css classes
 * @param onClick {Function} onClick Event
 * @param markup {BoxMarkup} Clickable Box => BoxMarkup.A Not clickable box => BoxMarkup.DIV || null
 * @param skeleton {boolean} add or remove is-loading & is-loaded classes
 * @param to {string} Box link
 */
const Box = ({ children, className, classList, onClick, markup, skeleton, to, ...others }: BoxProps): React.JSX.Element => {
  const [isLoading, setIsLoading] = React.useState<boolean>(skeleton || false)

  React.useEffect(() => {
    setIsLoading(skeleton || false)
  }, [skeleton])

  if (markup === BoxMarkup.A || to) {
    return (
      <a href={to} onClick={onClick && onClick} {...others}>
        <div className={classNames(styles.box, className, validate(classList), isLoading ? styles.isLoading : styles.isLoaded)}>{children}</div>
      </a>
    )
  }

  return (
    <div
      onClick={onClick && onClick}
      className={classNames(styles.box, className, validate(classList), isLoading ? styles.isLoading : styles.isLoaded)}
      {...others}
    >
      {children}
    </div>
  )
}

export { Box, type Styles }
