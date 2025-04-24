'use client'

import React from 'react'
import classNames from 'classnames'
import { validate } from '../../../services/index.js'
import { Text } from '../../text/index.js'
import { BoxHeaderProps } from './BoxHeaderProps.js'

// ///////////////////////////////////////////////////////////////////////////
// /!\ When typed-scss-modules --exportType default
import { default as styles, type Styles } from '@flex-design-system/framework'
// import { default as styles, type Styles } from '@flex-design-system/framework/main/all.module.scss'
// ///////////////////////////////////////////////////////////////////////////

/**
 * Box Header Component
 * @param className {string} Additionnal css classes
 * @param classList {array} Additionnal css classes
 * @param children {ReactNode} Children
 * @param help {string} Box Header Help Sticker
 */
const BoxHeader = ({ children, className, classList, help, ...others }: BoxHeaderProps): React.JSX.Element => (
  <header className={classNames(styles.boxHeader, className, validate(classList))} {...others}>
    {children && typeof children.valueOf() === 'string' ? <p>{children}</p> : children}
    {help && <Text className='box-header-help sticker is-small is-success'>{String(children)}</Text>}
  </header>
)

export default BoxHeader
