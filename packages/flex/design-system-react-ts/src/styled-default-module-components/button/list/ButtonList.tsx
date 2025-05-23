import React from 'react'
import classNames from 'classnames'
import { ButtonListWebProps } from './ButtonListProps.js'

/**
 * Button List Component
 * @param className {string} Additionnal CSS Classes
 */
const ButtonList = ({ className, ...others }: ButtonListWebProps): React.JSX.Element => <div className={classNames('buttons', className)} {...others} />

export default ButtonList
