/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */

'use server'

import React from 'react'
import classNames from 'classnames'
import { validate } from '../../../services/index.js'
import { Text, TextMarkup } from '../../text/index.js'
import { TabsItemProps } from './TabsItemProps.js'

// ///////////////////////////////////////////////////////////////////////////
// /!\ When typed-scss-modules --exportType default
import { default as styles, type Styles } from '@flex-design-system/framework'
// import { default as styles, type Styles } from '@flex-design-system/framework/main/all.module.scss'
// ///////////////////////////////////////////////////////////////////////////

/**
 * Tabs Item Component
 * @param active {boolean} active tab item
 * @param children {ReactChild} React Child Element
 * @param onClick onClick Event
 * - -------------------------- WEB PROPERTIES -------------------------------
 * @param className {string} Additionnal css classes
 * @param classList {array} Additionnal css classes
 */
const TabsItem = async ({ active, children, className, classList, onClick, ...others }: TabsItemProps): Promise<React.ReactNode> => {
  const [activeItem, setActiveItem] = React.useState<boolean>(active || false)

  // accessibility
  const a11y = {
    li: {
      role: 'presentation',
    },
    a: {
      role: 'tab',
      'aria-selected': activeItem,
    },
  }

  React.useEffect(() => {
    setActiveItem(active || false)
  }, [active])

  return (
    <li
      className={classNames(className, activeItem && styles.isActive, validate(classList))}
      {...a11y.li}
      {...others}
      onClick={(e: React.MouseEvent) => {
        const target = e.target as HTMLFormElement
        setActiveItem(active || false)
        target.active = active
        if (onClick) {
          onClick(e)
        }
      }}
    >
      {children && typeof children.valueOf() === 'string' && (
        <Text markup={TextMarkup.A} {...a11y.a} {...others}>
          {String(children)}
        </Text>
      )}
    </li>
  )
}

export default TabsItem
