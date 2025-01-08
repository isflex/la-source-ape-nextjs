import React from 'react'
import classNames from 'classnames'
import { AccordionHeaderProps } from './AccordionHeaderProps.js'

// accessibility
const a11y = {
  'aria-label': 'toggle',
}

/**
 * Accordion Header
 * @param className {string} Additionnal CSS Classes
 * @param toggle {boolean} Toggle Header
 * @param toggleBox {string} toggle direction
 * @param toggleBoxClass {string} Additionnal Classes for toggle box
 */
const AccordionHeader = ({ children, className, toggle, toggleBox, toggleBoxClass, ...others }: AccordionHeaderProps): React.JSX.Element => {
  const toggleBtnClasses = classNames('toggle button is-bordered is-shadowless', toggleBoxClass)

  return (
    <div className={classNames('accordion-header', className)} {...others}>
      {toggleBox === 'left' && <button className={toggleBtnClasses} {...a11y} />}
      {children}
      {toggle && <button className='toggle' {...a11y} />}
      {toggleBox === 'right' && <button className={toggleBtnClasses} {...a11y} />}
    </div>
  )
}

export default AccordionHeader
