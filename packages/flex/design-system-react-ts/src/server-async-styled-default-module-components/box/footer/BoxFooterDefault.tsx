'use server'

import React from 'react'
import classNames from 'classnames'
import { validate } from '../../../services/index.js'
import { BoxFooterProps } from './BoxFooterProps.js'

// ///////////////////////////////////////////////////////////////////////////
// /!\ When typed-scss-modules --exportType default
import { default as styles, type Styles } from '@flex-design-system/framework'
// import { default as styles, type Styles } from '@flex-design-system/framework/main/all.module.scss'
// ///////////////////////////////////////////////////////////////////////////

/**
 * Box Footer Component
 * @param className {string} Additionnal css classes
 * @param classList {array} Additionnal css classes
 * @param children {ReactNode} Children
 */
const BoxFooter = async ({ className, classList, children, ...others }: BoxFooterProps): Promise<React.AwaitedReactNode> => (
  <div className={classNames(styles.boxFooter, className, validate(classList))} {...others}>
    {children}
  </div>
)

export default BoxFooter
