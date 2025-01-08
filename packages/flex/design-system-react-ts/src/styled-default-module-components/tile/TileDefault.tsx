'use client'

import React from 'react'
import classNames from 'classnames'
import { is, validate } from '../../services/index.js'
import { camelCase } from 'lodash'
import { Text } from '../text/index.js'
import { TileProps } from './TileProps.js'
import { TileMarkup } from './TileEnum.js'
import { Link as RouterLink } from 'react-router'

// ///////////////////////////////////////////////////////////////////////////
// /!\ When typed-scss-modules --exportType default
import { default as styles, type Styles } from '@flex-design-system/framework'
// import styles from 'flex-design-system-framework/main/all.module.scss'
// import { type Styles } from '@flex-design-system/framework/main/all.module.scss'
// ///////////////////////////////////////////////////////////////////////////

/**
 * Tile Component
 * @param children {ReactNode} Tile Children
 * @param className {string} Additionnal css classes
 * @param classList {array} Additionnal css classes
 * @param onClick {Function} onClick Event
 * @param to {string} link to url
 * @param ancestor {boolean} Tile is an ancestor
 * @param child {boolean} Tile is a child
 * @param parent {boolean} Tile is a parent
 * @param vertical {boolean} Tile is vertical
 * @param markup {TileMarkup} HTML element : div|a
 */
const Tile = ({
  children,
  className,
  classList,
  ancestor,
  child,
  markup = TileMarkup.DIV,
  onClick,
  to,
  parent,
  vertical,
  ...others
}: TileProps): React.JSX.Element => {
  const classes = classNames(
    styles.tile,
    ancestor && styles[camelCase(is('ancestor')) as keyof Styles],
    child && styles[camelCase(is('child')) as keyof Styles],
    parent && styles[camelCase(is('parent')) as keyof Styles],
    vertical && styles[camelCase(is('vertical')) as keyof Styles],
    className,
    validate(classList),
  )

  const Tag = markup

  const content: React.ReactNode = Array.isArray(children) ? (
    children.map((child: React.ReactNode, index: number) => {
      return child && typeof child.valueOf() === 'string' ? <Text key={index}>{String(child)}</Text> : child
    })
  ) : children && typeof children.valueOf() === 'string' ? (
    <Text>{String(children)}</Text>
  ) : (
    children
  )
  if (to != null) {
    return (
      <RouterLink className={classes} {...others} onClick={onClick} to={to}>
        <span>{content}</span>
      </RouterLink>
    )
  }
  return (
    <Tag className={classes} {...others} onClick={onClick}>
      {content}
    </Tag>
  )
}

export default Tile
