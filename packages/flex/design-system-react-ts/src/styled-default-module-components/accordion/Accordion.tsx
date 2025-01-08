import React from 'react'
import classNames from 'classnames'
import { AccordionProps } from './AccordionProps.js'
import { is } from '../../services/index.js'

/**
 * Accordion Component
 * @param className {string} Additionnal CSS Classes
 * @param boxed {boolean} Boxed Accordion
 */
const Accordion = ({ className, boxed, ...others }: AccordionProps): React.JSX.Element => {
  const classes = classNames('accordions', boxed && is('boxed'), className)
  return <section className={classes} {...others} />
}

export default Accordion
