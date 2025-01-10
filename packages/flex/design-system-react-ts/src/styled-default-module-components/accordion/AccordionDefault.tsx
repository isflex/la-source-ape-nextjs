'use client'

import React from 'react'
import classNames from 'classnames'
import { is, validate } from '../../services/index.js'
import { camelCase } from 'lodash'
import { AccordionProps } from './AccordionProps.js'

// ///////////////////////////////////////////////////////////////////////////
// /!\ When typed-scss-modules --exportType default
import { default as styles, type Styles } from '@flex-design-system/framework'
// import { default as styles, type Styles } from '@flex-design-system/framework/main/all.module.scss'
// ///////////////////////////////////////////////////////////////////////////

/**
 * Accordion Component
 * @param className {string} Additionnal css classes
 * @param classList {array} Additionnal css classes
 * @param boxed {boolean} Boxed Accordion
 */
const Accordion = ({ className, classList, boxed, ...others }: AccordionProps): React.JSX.Element => {
  const classes = classNames(styles.accordions, boxed && styles[camelCase(is('boxed')) as keyof Styles], className, validate(classList))
  return <section className={classes} {...others} />
}

export default Accordion
