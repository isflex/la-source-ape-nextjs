'use server'

import React from 'react'
import classNames from 'classnames'
import { ListProps } from './ListProps.js'

/**
 * ListItem Component
 * @param className {string} Additionnal CSS Classes
 */

const List = async ({ className, hasIcon, children, ...others }: ListProps): Promise<React.AwaitedReactNode> => {
  const classes = classNames(hasIcon ? 'icon-list' : 'list', className)
  return (
    <ul className={classes} {...others}>
      {children}
    </ul>
  )
}

export default List
