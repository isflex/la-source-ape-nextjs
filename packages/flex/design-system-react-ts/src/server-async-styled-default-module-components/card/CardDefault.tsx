// @ts-nocheck

'use server'

import React from 'react'
import classNames from 'classnames'
import { validate } from '../../services/index.js'
import { CardProps } from './CardProps.js'

// ///////////////////////////////////////////////////////////////////////////
// /!\ When typed-scss-modules --exportType default
import { default as styles } from '@flex-design-system/framework'
// import { default as styles, type Styles } from '@flex-design-system/framework'
// import styles from 'flex-design-system-framework/main/all.module.scss'
// import { type Styles } from '@flex-design-system/framework/main/all.module.scss'
// ///////////////////////////////////////////////////////////////////////////

/**
 * Card Component
 * @param flat Adding border for Card content
 * @param horizontal Horizontal Card orientation
 * @param floating Floating card
 * - ------------------ WEB PROPERTIES -----------------------
 * @param className Additionnal CSS Classes
 * @param classList {array} Additionnal css classes
 * @param skeleton Loading card
 */
const Card = async ({ className, classList, flat, horizontal, floating, skeleton, ...others }: CardProps): Promise<React.JSX.Element> => {
  const classes = classNames(
    styles.card,
    flat && styles.isFlat,
    horizontal && [styles.isHorizontal, styles.isVcentered],
    floating && styles.isFloating,
    skeleton ? styles.isLoading : styles.isLoaded,
    className,
    validate(classList),
  )

  return <div className={classes} {...others} />
}

export default Card
