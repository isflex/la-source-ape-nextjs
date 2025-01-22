'use server'

import React from 'react'
import classNames from 'classnames'
import { HeroProps } from './HeroProps.js'
import { is, has } from '../../services/index.js'

/**
 * Hero Component
 * @param children {ReactNode} Hero Children
 * @param backgroundSrc {string} If source, it will display background option
 * @param variant {VariantState} Hero background color : primary|secondary|tertiary
 * - -------------------------- WEB PROPERTIES -------------------------------
 * @param className {string} Additionnal CSS Classes
 */
const Hero = async ({ children, className, backgroundSrc, variant, ...others }: HeroProps): Promise<React.AwaitedReactNode> => {
  const classes = classNames(
    'hero',
    variant && has(`background-${variant.getClassName()}`),
    backgroundSrc && [is('primary'), has('background')],
    className,
  )

  if (variant) {
    return (
      <section className={classes} {...others}>
        <div className={classNames('hero-body')}>{children}</div>
      </section>
    )
  }

  return (
    <section {...(backgroundSrc && { style: { backgroundImage: `url(${backgroundSrc})` } })} className={classes} {...others}>
      <div className={classNames('hero-body')}>{children}</div>
    </section>
  )
}

export default Hero
