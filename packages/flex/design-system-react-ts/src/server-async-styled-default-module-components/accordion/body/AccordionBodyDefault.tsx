'use client'

import React from 'react'
import classNames from 'classnames'
import { validate } from '../../../services/index.js'
import { AccordionBodyProps } from './AccordionBodyProps.js'

// ///////////////////////////////////////////////////////////////////////////
// /!\ When typed-scss-modules --exportType default
import { default as styles, type Styles } from '@flex-design-system/framework'
// import { default as styles, type Styles } from '@flex-design-system/framework/main/all.module.scss'
// ///////////////////////////////////////////////////////////////////////////

/**
 * Accordion Body Component
 * @param className {string} Additionnal css classes
 * @param classList {array} Additionnal css classes
 * @param children {ReactNode} Children for Accordion body
 * @param withAction {boolean} override bottom margin of accordion body when followed by accordion action
 */
const AccordionBody = ({ children, className, classList, withAction = false, ...others }: AccordionBodyProps): React.JSX.Element => (
  <div className={classNames(styles.accordionBody, styles.isClipped, className, validate(classList), withAction && styles.withAction)} {...others}>
    <div className={styles.accordionBodyContent}>{children}</div>
  </div>
)

export default AccordionBody
