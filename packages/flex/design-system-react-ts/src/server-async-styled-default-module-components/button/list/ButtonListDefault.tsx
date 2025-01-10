'use server'

import React from 'react'
import classNames from 'classnames'
import { validate } from '../../../services/index.js'
import { ButtonListWebProps } from './ButtonListProps.js'

// ///////////////////////////////////////////////////////////////////////////
// /!\ When typed-scss-modules --exportType default
import { default as styles, type Styles } from '@flex-design-system/framework'
// import { default as styles, type Styles } from '@flex-design-system/framework/main/all.module.scss'
// ///////////////////////////////////////////////////////////////////////////

/**
 * Button List Component
 * @param className {string} Additionnal css classes
 * @param classList {array} Additionnal css classes
 */
const ButtonList = async ({ className, classList, ...others }: ButtonListWebProps): Promise<React.JSX.Element> => (
  <div className={classNames(styles.buttons, className, validate(classList))} {...others} />
)

export default ButtonList
