'use server'

import React from 'react'
import classNames from 'classnames'
import { CardProps } from './CardProps.js'
import { is } from '../../services/index.js'

/**
 * Card Component
 * @param flat Adding border for Card content
 * @param horizontal Horizontal Card orientation
 * @param floating Floating card
 * - ------------------ WEB PROPERTIES -----------------------
 * @param className Additionnal CSS Classes
 * @param skeleton Loading card
 */
const Card = async ({ className, flat, horizontal, floating, skeleton, ...others }: CardProps): Promise<React.ReactNode> => {
  const [isLoading, setIsLoading] = React.useState<boolean>(skeleton || false)

  React.useEffect(() => {
    setIsLoading(skeleton || false)
  }, [skeleton])

  const classes = classNames(
    'card',
    flat && is('flat'),
    horizontal && [is('horizontal'), is('vcentered')],
    floating && is('floating'),
    isLoading ? is('loading') : is('loaded'),
    className,
  )

  return <div className={classes} {...others} />
}

export default Card
