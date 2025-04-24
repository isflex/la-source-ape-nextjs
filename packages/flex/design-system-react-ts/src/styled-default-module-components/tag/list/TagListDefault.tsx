'use client'

import React from 'react'
import classNames from 'classnames'
import { validate } from '../../../services/index.js'
import { TagListProps } from './TagListProps.js'

// ///////////////////////////////////////////////////////////////////////////
// /!\ When typed-scss-modules --exportType default
import { default as styles, type Styles } from '@flex-design-system/framework'
// import { default as styles, type Styles } from '@flex-design-system/framework/main/all.module.scss'
// ///////////////////////////////////////////////////////////////////////////

/**
 * Tag List Component
 * @param children {ReactNode} Children Tag List
 *  - -------------------------- WEB PROPERTIES -------------------------------
 * @param className {string} Additionnal CSS Classes
 */
const TagList = ({ className, classList, ...others }: TagListProps): React.JSX.Element => (
  <span className={classNames(styles.tags, className, validate(classList))} {...others} />
)

export default TagList
