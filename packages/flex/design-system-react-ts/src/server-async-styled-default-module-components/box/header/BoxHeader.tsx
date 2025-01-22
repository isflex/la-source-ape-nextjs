'use server'

import React from 'react'
import classNames from 'classnames'
import { Text } from '../../text/index.js'
import { BoxHeaderProps } from './BoxHeaderProps.js'

/**
 * Box Header Component
 * @param className {string} Additionnal CSS Classes
 * @param children {ReactNode} Children
 * @param help {string} Box Header Help Sticker
 */
const BoxHeader = async ({ children, className, help, ...others }: BoxHeaderProps): Promise<React.AwaitedReactNode> => (
  <header className={classNames('box-header', className)} {...others}>
    {children && typeof children.valueOf() === 'string' ? <p>{children}</p> : children}
    {help && <Text className='box-header-help sticker is-small is-success'>{String(children)}</Text>}
  </header>
)

export default BoxHeader
