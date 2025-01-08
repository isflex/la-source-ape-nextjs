import React from 'react'
import classNames from 'classnames'
import { BoxContentProps } from './BoxContentProps.js'

/**
 * Box Content
 * @param children {ReactNode} Box Content Children
 * @param className {string} Additionnal CSS Classes
 */
const BoxContent = ({ children, className, ...others }: BoxContentProps): React.JSX.Element => {
  return (
    <div className={classNames('box-content', className)} {...others}>
      {children}
    </div>
  )
}

export default BoxContent
