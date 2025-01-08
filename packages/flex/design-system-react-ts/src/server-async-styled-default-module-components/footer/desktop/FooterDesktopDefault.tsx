// @ts-nocheck

'use server'

import React from 'react'
import classNames from 'classnames'
import { validate } from '../../../services/index.js'
import { FooterDesktopWebProps } from './FooterDesktopProps.js'
import { Accordion } from '../../accordion/index.js'

// ///////////////////////////////////////////////////////////////////////////
// /!\ When typed-scss-modules --exportType default
import { default as styles } from '@flex-design-system/framework'
// import { default as styles, type Styles } from '@flex-design-system/framework'
// import styles from 'flex-design-system-framework/main/all.module.scss'
// import { type Styles } from '@flex-design-system/framework/main/all.module.scss'
// ///////////////////////////////////////////////////////////////////////////

/**
 * Footer Desktop Component
 * @param children {ReactNode} Desktop Footer Children
 * @param className {string} Additionnal CSS Classes
 * @param classList {array} Additionnal css classes
 * @param fullwidth {boolean} Footer fullwidth
 */
const FooterDesktop = async ({ children, className, classList, fullwidth, ...others }: FooterDesktopWebProps): Promise<React.JSX.Element> => {
  const classes = classNames(styles.isHiddenTouch, styles.isFooterDesktop, fullwidth && styles.isFullwidth, className, validate(classList))

  // Desktop Footer
  return (
    <Accordion className={classes} {...others}>
      {children}
    </Accordion>
  )
}

export default FooterDesktop
