'use server'

// @ts-nocheck

import React from 'react'
import { ViewProps } from './ViewProps.js'
import classNames from 'classnames'
import { is, validate } from '../../services/index.js'
import { camelCase } from 'lodash'

// ///////////////////////////////////////////////////////////////////////////
// /!\ When typed-scss-modules --exportType default
import { default as styles, type Styles } from '@flex-design-system/framework'
// import styles from 'flex-design-system-framework/main/all.module.scss'
// import { type Styles } from '@flex-design-system/framework/main/all.module.scss'
// ///////////////////////////////////////////////////////////////////////////

/**
 * View Component (DIV EQUIVALENT)
 * @param children {string} View child
 * @param style {CSSProperties} View custom style
 * - ------------------ WEB PROPERTIES ---------------
 * @param className {string} Additionnal css classes
 * @param loading {Loading} Loading View
 * @param theme {Theme} Themed View
 */
const View = async ({ children, style, className, classList, loading, theme, ...others }: ViewProps): Promise<React.JSX.Element> => {
  const classes = classNames(loading && styles[camelCase(is(loading.getClassName())) as keyof Styles], className, validate(classList))

  if (!children) {
    return <div style={style} {...(theme ? { ['data-flex-theme']: theme } : {})} {...others} />
  }

  return (
    <div style={style} {...(theme ? { ['data-flex-theme']: theme } : {})} className={classes} {...others}>
      {children}
    </div>
  )
}

export default View
