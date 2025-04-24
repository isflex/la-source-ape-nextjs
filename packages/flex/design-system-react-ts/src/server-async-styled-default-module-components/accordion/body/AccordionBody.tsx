import React from 'react'
import classNames from 'classnames'
import { AccordionBodyProps } from './AccordionBodyProps.js'

/**
 * Accordion Body Component
 * @param className {string} Additionnal CSS Classes
 * @param children {ReactNode} Children for Accordion body
 */
const AccordionBody = ({ children, className, ...others }: AccordionBodyProps): React.JSX.Element => (
  <div className={classNames('accordion-body is-clipped', className)} {...others}>
    <div className='accordion-content'>{children}</div>
  </div>
)

export default AccordionBody
