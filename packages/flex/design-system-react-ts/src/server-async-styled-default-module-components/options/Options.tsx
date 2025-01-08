// @ts-nocheck

'use server'

import React from 'react'
import classNames from 'classnames'
import { OptionsProps } from './OptionsProps.js'
import { is } from '../../services/index.js'

/**
 * Options Component
 * @param className {string} Additionnal CSS Classes
 * @param inverted {boolean} Inverted options
 */
const Options = async ({ className, inverted, ...others }: OptionsProps): Promise<React.JSX.Element> => {
  const classes = classNames('options', inverted && is('inverted'), className)

  return <div className={classes} {...others} />
}

export default Options
