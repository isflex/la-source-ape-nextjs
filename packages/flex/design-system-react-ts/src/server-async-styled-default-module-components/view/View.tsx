// @ts-nocheck

'use server'

import React from 'react'
import { ViewProps } from './ViewProps.js'
import classNames from 'classnames'
import { is } from '../../services/index.js'

/**
 * View Component (DIV EQUIVALENT)
 * @param children {string} View child
 * @param style {CSSProperties} View custom style
 * - ------------------ WEB PROPERTIES ---------------
 * @param className {string} Additionnal css classes
 * @param loading {Loading} Loading View
 */
const View = async ({ children, style, className, loading, ...others }: ViewProps): Promise<React.JSX.Element> => {
  const classes = classNames(loading && is(loading.getClassName()), className)
  if (!children) {
    return <div style={style} {...others} />
  }

  return (
    <div style={style} className={classes} {...others}>
      {children}
    </div>
  )
}

export default View
