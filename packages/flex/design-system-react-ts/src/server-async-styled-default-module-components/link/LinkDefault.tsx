'use server'

import React from 'react'
import classNames from 'classnames'
import { validate, is, has } from '../../services/index.js'
import { camelCase } from 'lodash'
import { Text, TextMarkup } from '../text/index.js'
import { LinkProps } from './LinkProps.js'
import { Link as RouterLink } from 'react-router'

// ///////////////////////////////////////////////////////////////////////////
// /!\ When typed-scss-modules --exportType default
import { default as styles, type Styles } from '@flex-design-system/framework'
// import { default as styles, type Styles } from '@flex-design-system/framework/main/all.module.scss'
// ///////////////////////////////////////////////////////////////////////////

/**
 * Link Component
 * @param children {string} Content children for Link
 * @param fixed {boolean} Static link with no animation
 * @param plain {boolean} Link without underline
 * @param to {string} Url to open
 * @param tertiary {boolean} Tertiary variant
 * @param title {string} Title attribute
 * @param onClick {Function} onClick Event
 * - -------------------------- WEB PROPERTIES -------------------------------
 * @param className {string} Additionnal css classes
 * @param classList {array} Additionnal css classes
 * @param href {string} Href link
 * @param target {string} target
 * @param rel {string} rel
 */
const Link = async ({
  children,
  className,
  classList,
  removeLinkClass,
  inverted,
  fixed,
  plain,
  to,
  href,
  tertiary,
  flexPurple,
  title,
  onClick,
  ...others
}: LinkProps): Promise<React.ReactNode> => {
  const classes = classNames(
    !removeLinkClass && styles.link,
    inverted && styles[camelCase(is('inverted')) as keyof Styles],
    fixed && styles[camelCase(is('static')) as keyof Styles],
    plain && styles[camelCase(is('plain')) as keyof Styles],
    tertiary && styles[camelCase(has('text-tertiary')) as keyof Styles],
    flexPurple && styles[camelCase(has('text-flex-purple')) as keyof Styles],
    className,
    validate(classList),
  )

  if (to) {
    return (
      <RouterLink onClick={onClick && onClick} className={classes} to={to || ''} {...others}>
        <span>{title || children}</span>
      </RouterLink>
    )
  }

  return (
    <Text onClick={onClick && onClick} title={title} markup={TextMarkup.A} className={classes} href={href} {...others}>
      {children}
    </Text>
  )
}

export default Link
