'use server'

import React from 'react'
import classNames from 'classnames'
// import { camelCase } from 'lodash'
import { validate } from '../../../services/index.js'
import { ListItemProps, ListIconStatus } from './ListItemProps.js'
import { Icon, IconSize } from '../../icon/index.js'
// import { is } from '../../../services/index.js'

// ///////////////////////////////////////////////////////////////////////////
// /!\ When typed-scss-modules --exportType default
import { default as styles, type Styles } from '@flex-design-system/framework'
// import { default as styles, type Styles } from '@flex-design-system/framework/main/all.module.scss'
// ///////////////////////////////////////////////////////////////////////////

/**
 * ListItem Component
 * @param className {string} Additionnal CSS Classes
 */

const ListItem = async ({ className, classList, children, customIcon, status, title, description }: ListItemProps): Promise<React.AwaitedReactNode> => {
  const classes = classNames(className, validate(classList))

  if (customIcon) {
    return (
      <li className={classes}>
        <Icon
          className={classNames(
            // styles[camelCase(is(`${status}`))],
            {
              [styles.isDanger]: status === ListIconStatus.DANGER,
              [styles.isSuccess]: status === ListIconStatus.SUCCESS,
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
