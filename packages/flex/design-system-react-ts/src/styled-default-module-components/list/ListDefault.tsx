'use client'

import React from 'react'
import classNames from 'classnames'
import { validate } from '../../services/index.js'
import { ListProps } from './ListProps.js'

// ///////////////////////////////////////////////////////////////////////////
// /!\ When typed-scss-modules --exportType default
import { default as styles, type Styles } from '@flex-design-system/framework'
// import { default as styles, type Styles } from '@flex-design-system/framework/main/all.module.scss'
// ///////////////////////////////////////////////////////////////////////////

/**
 * ListItem Component
 * @param className {string} Additionnal css classes
 * @param classList {array} Additionnal css classes
 */

const List = ({ className, classList, hasIcon, children, ...others }: ListProps): React.JSX.Element => {
  const classes = classNames(hasIcon && styles.iconList, className, validate(classList))

  return (
    <ul className={classes} {...others}>
      {children}
    </ul>
  )
}

export default List
