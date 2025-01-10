'use server'

// @ts-nocheck

import React from 'react'
import classNames from 'classnames'
import { has, validate } from '../../services/index.js'
import { camelCase } from 'lodash'
import { HeroProps } from './HeroProps.js'

// ///////////////////////////////////////////////////////////////////////////
// /!\ When typed-scss-modules --exportType default
import { default as styles, type Styles } from '@flex-design-system/framework'
// import { default as styles, type Styles } from '@flex-design-system/framework/main/all.module.scss'
// ///////////////////////////////////////////////////////////////////////////

/**
 * Hero Component
 * @param children {ReactNode} Hero Children
 * @param backgroundSrc {string} If source, it will display background option
 * @param variant {VariantState} Hero background color : primary|secondary|tertiary
 * - -------------------------- WEB PROPERTIES -------------------------------
 * @param className {string} Additionnal CSS Classes
 * @param classList {array} Additionnal css classes
 */
const Hero = async ({ children, className, classList, backgroundSrc, variant, ...others }: HeroProps): Promise<React.JSX.Element> => {
  const classes = classNames(
    styles.hero,
    variant && styles[camelCase(has(`background-${variant.getClassName()}`)) as keyof Styles],
    backgroundSrc && [styles.isPrimary, styles.hasBackground],
    className,
    validate(classList),
  )

  if (variant) {
    return (
      <section className={classes} {...others}>
        <div className={classNames(styles.heroBody)}>{children}</div>
      </section>
    )
  }

  return (
    <section {...(backgroundSrc && { style: { backgroundImage: `url(${backgroundSrc})` } })} className={classes} {...others}>
      <div className={classNames(styles.heroBody)}>{children}</div>
    </section>
  )
}

export default Hero
