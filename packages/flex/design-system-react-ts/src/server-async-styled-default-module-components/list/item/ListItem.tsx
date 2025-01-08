// @ts-nocheck

'use server'

import React from 'react'
import classNames from 'classnames'
import { ListItemProps, ListIconStatus } from './ListItemProps.js'
import { Icon, IconSize } from '../../icon/index.js'
// import { is } from '../../../services/index.js'

/**
 * ListItem Component
 * @param className {string} Additionnal CSS Classes
 */

const ListItem = async ({ className, children, customIcon, status, title, description }: ListItemProps): Promise<React.JSX.Element> => {
  const classes = classNames(className)

  if (customIcon) {
    return (
      <li className={classes}>
        <Icon
          className={classNames(
            // is(`${status}`),
            {
              'is-danger': status === ListIconStatus.DANGER,
              'is-success': status === ListIconStatus.SUCCESS,
            },
          )}
          name={customIcon}
          size={IconSize.SMALL}
        />
        <span>{children}</span>
      </li>
    )
  }

  if (title || description) {
    return (
      <li className={classes}>
        <b>{title}</b>
        <p>{children || description}</p>
        <br />
      </li>
    )
  }

  return <li className={classes}>{children}</li>
}

export default ListItem
