// @ts-nocheck

'use server'

import React from 'react'
import classNames from 'classnames'
import { TagListProps } from './TagListProps.js'

/**
 * Tag List Component
 * @param children {ReactNode} Children Tag List
 *  - -------------------------- WEB PROPERTIES -------------------------------
 * @param className {string} Additionnal CSS Classes
 */
const TagList = async ({ className, ...others }: TagListProps): Promise<React.JSX.Element> => (
  <span className={classNames('tags', className)} {...others} />
)

export default TagList
