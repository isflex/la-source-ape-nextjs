import React, { useState, useEffect } from 'react'
import { StyleSheet, TouchableOpacity } from 'react-native'
import { TabsItemProps } from './TabsItemProps'
import { Text, TextLevel } from '../../text'

/**
 * Tabs Item Component
 * @param active {boolean} active tab item
 * @param children {ReactChild} React Child Element
 * @param onClick onClick Event
 */
const TabsItem = ({ active, children, onClick, ...others }: TabsItemProps): Promise<React.JSX.Element> => {
  const [activeItem, setActiveItem] = useState<boolean>(active || false)

  const tabsColor = '#109db9'

  const styles = StyleSheet.create({
    tabsItem: {
      flexDirection: 'column',
      flex: 6,
    },
    text: {
      color: tabsColor,
      textAlign: 'center',
      paddingBottom: 10,
    },
    active: {
      borderBottomColor: (activeItem && tabsColor) || '#fff',
      borderBottomWidth: 2,
    },
  })

  useEffect(() => {
    setActiveItem(active || false)
  }, [active])

  return (
    <TouchableOpacity
      style={[styles.tabsItem, activeItem && styles.active]}
      onPress={(e: unknown) => {
        setActiveItem(active || false)
        if (onClick) {
          onClick(e)
        }
      }}
      {...others}
    >
      {children && typeof children.valueOf() === 'string' && (
        <Text style={styles.text} level={TextLevel.LEVEL3}>
          {String(children)}
        </Text>
      )}
    </TouchableOpacity>
  )
}

export default TabsItem
