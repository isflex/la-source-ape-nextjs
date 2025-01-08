// @ts-nocheck

'use server'

import React from 'react'
import classNames from 'classnames'
import { is, validate } from '../../services/index.js'
import { camelCase } from 'lodash'
import TabsItem from './item/index.js'
import { Text } from '../text/index.js'
import { TabsProps } from './TabsProps.js'

// ///////////////////////////////////////////////////////////////////////////
// /!\ When typed-scss-modules --exportType default
import { default as styles, type Styles } from '@flex-design-system/framework'
// import styles from 'flex-design-system-framework/main/all.module.scss'
// import { type Styles } from '@flex-design-system/framework/main/all.module.scss'
// ///////////////////////////////////////////////////////////////////////////

/**
 * Tabs Component
 * @param children {ReactNode} Children for tabs
 * @param onClick onClick event
 * @param activeIndex {number} default active tab index
 * @param disabled {boolean} Disabled tabs
 * @param clipped {boolean} Remove the separator bar
 * - -------------------------- WEB PROPERTIES -------------------------------
 * @param centered {boolean} Centered tabs
 * @param rightAlign {boolean} Tabs right align
 * @param className {string} Additionnal css classes
 * @param classList {array} Additionnal css classes
 * @param fullwidth {boolean} Fullwidth tabs
 */
const Tabs = async ({
  children,
  className,
  classList,
  onClick,
  activeIndex,
  disabled,
  rightAlign,
  clipped,
  fullwidth,
  centered,
  ...others
}: TabsProps): Promise<React.JSX.Element> => {
  const [activateIndex, setActivateIndex] = React.useState<number>(activeIndex || 0)

  const classes = classNames(
    styles.tabs,
    rightAlign && styles[camelCase(is('right')) as keyof Styles],
    clipped && styles[camelCase(is('clipped')) as keyof Styles],
    fullwidth && styles[camelCase(is('fullwidth')) as keyof Styles],
    centered && styles[camelCase(is('centered')) as keyof Styles],
    className,
    validate(classList),
  )

  const isActive = (index: number, childPropsActive: React.ReactNode) => {
    if (typeof childPropsActive !== 'undefined' && !activateIndex) {
      return childPropsActive
    }
    if (index === activateIndex) {
      return true
    }
  }

  const toggleActive = (e: React.MouseEvent, index: number) => {
    if (disabled) {
      return false
    }
    setActivateIndex(index)
    if (onClick) {
      onClick(e)
    }
  }

  React.useEffect(() => {
    setActivateIndex(activateIndex)
  }, [activateIndex])

  return (
    <div className={classes} role='tablist' {...others}>
      <ul>
        {children &&
          Array.isArray(children) &&
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          children.map((child: any, index: number) => {
            const props = {
              active: Boolean(isActive(index, child.props.active)) || false,
              key: index,
              tabIndex: index,
              onClick: (event: React.MouseEvent) => {
                toggleActive(event, index)
                if (child) {
                  if (child.props.onClick) {
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
                    child.props.onClick(event)
                  }
                }
              },
            }

            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
            return typeof child.valueOf() === 'string' ? (
              <TabsItem active={props.active} onClick={(e: unknown) => onClick && onClick(e)}>
                <Text>{String(child)}</Text>
              </TabsItem>
            ) : (
              React.cloneElement(child, props)
            )
          })}
      </ul>
    </div>
  )
}

export default Tabs
