// @ts-nocheck

'use server'

import React from 'react'
import classNames from 'classnames'
import { TitleProps } from './TitleProps.js'
import { TitleLevel, TitleMarkup } from './TitleEnum.js'
import { is } from '../../services/index.js'

/**
 * Title component
 * @param children {ReactNode} Title child
 * @param level {TitleLevel|number} Title size : 1-7
 * @param inverted {Boolean} Title white color
 * - --------------- WEB PROPERTIES ----------------------------------
 * @param markup {string} h1 | h2 | h3 | h4 | h5 | h6 | p | span | div
 * @param className {string} Additionnal css classes
 * @param typo
 * @param skeleton
 * @param others
 */
const Title = async ({
  level = TitleLevel.LEVEL1, // defaultProps,
  markup,
  children,
  className,
  typo,
  skeleton,
  inverted,
  ...others
}: TitleProps): Promise<React.JSX.Element> => {
  const [isLoading, setIsLoading] = React.useState<boolean>(skeleton || false)
  const classes = classNames(
    {
      title: true,
      [is(`${level}`)]: level,
    },
    typo,
    isLoading ? is('loading') : is('loaded'),
    inverted && is('inverted'),
    className,
  )

  React.useEffect(() => {
    setIsLoading(skeleton || false)
  }, [skeleton])

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
