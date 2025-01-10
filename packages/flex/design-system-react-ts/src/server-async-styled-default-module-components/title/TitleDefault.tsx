'use server'

// @ts-nocheck

import React from 'react'
import classNames from 'classnames'
import { is, validate } from '../../services/index.js'
import { camelCase } from 'lodash'
import { TitleProps } from './TitleProps.js'
import { TitleLevel, TitleMarkup } from './TitleEnum.js'

// ///////////////////////////////////////////////////////////////////////////
// /!\ When typed-scss-modules --exportType default
import { default as styles, type Styles } from '@flex-design-system/framework'
// import { default as styles, type Styles } from '@flex-design-system/framework/main/all.module.scss'
// ///////////////////////////////////////////////////////////////////////////

/**
 * Title component
 * @param children {ReactNode} Title child
 * @param level {TitleLevel|number} Title size : 1-7
 * @param inverted {Boolean} Title white color
 * - --------------- WEB PROPERTIES ----------------------------------
 * @param markup {string} h1 | h2 | h3 | h4 | h5 | h6 | p | span | div
 * @param className {string} Additionnal css classes
 * @param classList {array} Additionnal css classes
 * @param typo
 * @param skeleton
 * @param others
 */
const Title = async ({
  level = TitleLevel.LEVEL1, // defaultProps,
  markup,
  children,
  className,
  classList,
  typo,
  skeleton,
  inverted,
  ...others
}: TitleProps): Promise<React.JSX.Element> => {
  const classes = classNames(
    {
      [styles.title]: true,
      [styles[camelCase(is(`${level}`)) as keyof Styles]]: level,
    },
    typo,
    skeleton ? styles[camelCase(is('loading')) as keyof Styles] : styles[camelCase(is('loaded')) as keyof Styles],
    inverted && styles[camelCase(is('inverted')) as keyof Styles],
    className,
    validate(classList),
  )

  /**
   * If no markup return div with default level 1
   * key in Enum works only in TS or with number enum for JS
   * for string enum (as in this case) we need to use Object.values.includes for JS usage
   * string enum aren't reverse mapped so the first solution doesn't work
   */
  const Tag = markup && (markup in TitleMarkup || Object.values(TitleMarkup).includes(markup)) ? markup : 'div'

  return (
    <Tag className={classes} {...others}>
      {children}
    </Tag>
  )
}

export default Title
