'use client'

import React from 'react'
import classNames from 'classnames'
import { validate } from '../../../services/index.js'
import { ToolbarSpaceWebProps } from './ToolbarSpaceProps.js'

// ///////////////////////////////////////////////////////////////////////////
// /!\ When typed-scss-modules --exportType default
import { default as styles, type Styles } from '@flex-design-system/framework'
// import { default as styles, type Styles } from '@flex-design-system/framework/main/all.module.scss'
// ///////////////////////////////////////////////////////////////////////////

/**
 * Toolbar Space Component
 * @param className {string} Additionnal CSS Classes
 * @param classList {array} Additionnal css classes
 */
const ToolbarSpace = ({ className, classList, ...others }: ToolbarSpaceWebProps): React.JSX.Element => (
  <div className={classNames(styles.toolbarSpace, className, validate(classList))} {...others} />
)

export default ToolbarSpace
