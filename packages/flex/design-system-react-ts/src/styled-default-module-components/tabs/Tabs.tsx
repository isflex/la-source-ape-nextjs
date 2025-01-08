import React from 'react'
import classNames from 'classnames'
import TabsItem from './item/index.js'
import { Text } from '../text/index.js'
import { TabsProps } from './TabsProps.js'
import { is } from '../../services/index.js'

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
 * @param className {string} Additionnal CSS Classes
 * @param fullwidth {boolean} Fullwidth tabs
 */
const Tabs = ({
  children,
  className,
  onClick,
  activeIndex,
  disabled,
  rightAlign,
  clipped,
  fullwidth,
  centered,
  ...others
}: TabsProps): React.JSX.Element => {
  const [activateIndex, setActivateIndex] = React.useState<number>(activeIndex || 0)

  const classes = classNames(
    'tabs',
    rightAlign && is('right'),
    clipped && is('clipped'),
    fullwidth && is('fullwidth'),
    centered && is('centered'),
    className,
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
