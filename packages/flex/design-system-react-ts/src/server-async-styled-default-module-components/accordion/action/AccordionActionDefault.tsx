'use client'

import React from 'react'
import classNames from 'classnames'
import { validate } from '../../../services/index.js'
import { AccordionActionProps } from './AccordionActionProps.js'

// ///////////////////////////////////////////////////////////////////////////
// /!\ When typed-scss-modules --exportType default
// import styles from 'flex-design-system-framework/main/all.module.scss'
// import { type Styles } from '@flex-design-system/framework/main/all.module.scss'
// ///////////////////////////////////////////////////////////////////////////

/**
 * Accordion Action
 * @param className {string} Additionnal css classes
 * @param classList {array} Additionnal css classes
 */
const AccordionAction = ({ children, className, classList, ...others }: AccordionActionProps): React.JSX.Element => {
  return (
    <div className={classNames(className, validate(classList))} {...others}>
      {children}
    </div>
  )
}

export default AccordionAction
