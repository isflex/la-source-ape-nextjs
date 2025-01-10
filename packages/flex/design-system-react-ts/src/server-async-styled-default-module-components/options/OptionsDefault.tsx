// @ts-nocheck

'use server'

import React from 'react'
import classNames from 'classnames'
import { validate } from '../../services/index.js'
import { OptionsProps } from './OptionsProps.js'

// ///////////////////////////////////////////////////////////////////////////
// /!\ When typed-scss-modules --exportType default
import { default as styles, type Styles } from '@flex-design-system/framework'
// import { default as styles, type Styles } from '@flex-design-system/framework/main/all.module.scss'
// ///////////////////////////////////////////////////////////////////////////

/**
 * Options Component
 * @param className {string} Additionnal CSS Classes
 * @param inverted {boolean} Inverted options
 */
const Options = async ({ className, classList, inverted, ...others }: OptionsProps): Promise<React.JSX.Element> => {
  const classes = classNames(styles.options, inverted && styles.isInverted, className, validate(classList))

  return <div className={classes} {...others} />
}

export default Options
