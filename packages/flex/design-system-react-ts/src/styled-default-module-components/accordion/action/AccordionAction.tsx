import React from 'react'
import classNames from 'classnames'
import { AccordionActionProps } from './AccordionActionProps.js'

/**
 * Accordion Action
 * @param className {string} Additionnal CSS Classes
 */
const AccordionAction = ({ children, className, ...others }: AccordionActionProps): React.JSX.Element => {
  return (
    <div className={classNames('accordion-action', className)} {...others}>
      {children}
    </div>
  )
}

export default AccordionAction
