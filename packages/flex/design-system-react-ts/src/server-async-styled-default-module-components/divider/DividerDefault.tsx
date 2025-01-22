'use server'

import React from 'react'
import classNames from 'classnames'
import { is, validate } from '../../services/index.js'
import { camelCase } from 'lodash'
import { DividerProps } from './DividerProps.js'

// ///////////////////////////////////////////////////////////////////////////
// /!\ When typed-scss-modules --exportType default
import { default as styles, type Styles } from '@flex-design-system/framework'
// import { default as styles, type Styles } from '@flex-design-system/framework/main/all.module.scss'
// ///////////////////////////////////////////////////////////////////////////

/**
 * Divider Component
 * @param content {string} Add text content for Divider
 * @param unboxed {boolean} Full-width separator in another component
 * @param marginless {boolean} Marginless divider
 * - -------------------------- WEB PROPERTIES -------------------------------
 * @param className {string} Additionnal css classes
 * @param classList {array} Additionnal css classes (ONLY FOR WEB)

 */
const Divider = async ({ className, classList, unboxed, content, marginless, ...others }: DividerProps): Promise<React.AwaitedReactNode> => {
  const classes = classNames(
    styles[camelCase(is('divider')) as keyof Styles],
    unboxed && styles[camelCase(is('unboxed')) as keyof Styles],
    marginless && styles[camelCase(is('marginless')) as keyof Styles],
    className,
    validate(classList),
  )

  if (content) {
    return <hr className={classes} {...others} data-content={content} />
  }

  return <hr className={classes} {...others} />
}

export default Divider
