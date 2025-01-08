'use client'

import React from 'react'
import classNames from 'classnames'
import { validate } from '../../../services/index.js'
import { AccordionHeaderProps } from './AccordionHeaderProps.js'

// ///////////////////////////////////////////////////////////////////////////
// /!\ When typed-scss-modules --exportType default
import { default as styles } from '@flex-design-system/framework'
// import { default as styles, type Styles } from '@flex-design-system/framework'
// import styles from 'flex-design-system-framework/main/all.module.scss'
// import { type Styles } from '@flex-design-system/framework/main/all.module.scss'
// ///////////////////////////////////////////////////////////////////////////

// accessibility
const a11y = {
  'aria-label': 'toggle',
}

/**
 * Accordion Header
 * @param className {string} Additionnal css classes
 * @param classList {array} Additionnal css classes
 * @param toggle {boolean} Toggle Header
 * @param toggleBox {string} toggle direction
 * @param toggleBoxClass {string} Additionnal Classes for toggle box
 */
const AccordionHeader = ({
  children,
  className,
  classList,
  toggle,
  toggleBox,
  toggleBoxClass,
  ...others
}: AccordionHeaderProps): React.JSX.Element => {
  const toggleBtnClasses = classNames(styles.toggle, styles.button, styles.isBordered, styles.isShadowless, toggleBoxClass)

  return (
    <div className={classNames(styles.accordionHeader, className, validate(classList))} {...others}>
      {toggleBox === 'left' && <button className={toggleBtnClasses} {...a11y} />}
      <div className={styles.accordionHeaderContent}>{children}</div>
      {toggle && <button className={styles.toggle} {...a11y} />}
      {toggleBox === 'right' && <button className={toggleBtnClasses} {...a11y} />}
    </div>
  )
}

export default AccordionHeader
