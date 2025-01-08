import React, { useState } from 'react'
import { StyleSheet } from 'react-native'
import { TabsProps } from './TabsProps'
import { View, Text, TextLevel } from '../'
import TabsItem from './item'

/**
 * Tabs Component
 * @param children {ReactNode} Children for tabs
 * @param onClick onClick event
 * @param activeIndex {number} default active tab index
 * @param disabled {boolean} Disabled tabs
 * @param clipped {boolean} Remove the separator bar
 */
const Tabs = ({ children, onClick, activeIndex, disabled, clipped, ...others }: TabsProps): React.JSX.Element => {
  const [activateIndex, setActivateIndex] = useState(activeIndex)

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

  const styles = StyleSheet.create({
    tabs: {
      flexDirection: 'row',
      width: '100%',
      height: 'auto',
      borderBottomWidth: !clipped ? 1 : 0,
      borderBottomColor: !clipped ? '#B3B3B3B3' : 'transparent',
    },
  })

  return (
    <View style={styles.tabs} {...others}>
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
                  child.props.onClick(event)
                }
              }
            },
          }
          return typeof child.valueOf() === 'string' ? (
            <TabsItem active={props.active} onClick={(e: unknown) => onClick && onClick(e)}>
              <Text level={TextLevel.LEVEL3}>{String(child)}</Text>
            </TabsItem>
          ) : (
            React.cloneElement(child, props)
          )
        })}
    </View>
  )
}

export default Tabs
