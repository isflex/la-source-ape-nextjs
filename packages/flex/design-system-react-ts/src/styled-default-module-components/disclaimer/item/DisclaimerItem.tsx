import React from 'react'
import classNames from 'classnames'
import { DisclaimerItemWebProps } from './DisclaimerItemProps.js'

/**
 * Disclaimer Item component
 * @param children {ReactNode} Diclaimer Item Children
 * @param className {string} Additionnal css classes
 */
const DisclaimerItem = ({ className, ...others }: DisclaimerItemWebProps): React.JSX.Element => {
  const classes = classNames('disclaimer-item', className)

  return <div className={classes} {...others} />
}

export default DisclaimerItem
