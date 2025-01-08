import React from 'react'
import { StyleSheet } from 'react-native'
import { TableHeadProps } from './TableHeadProps'
import { View } from '../../view'

/**
 * Table Head Component
 * @param children {ReactNode} children of Table Head
 */
const TableHead = ({ children, ...others }: TableHeadProps): Promise<React.JSX.Element> => {
  const styles = StyleSheet.create({
    head: {
      width: '100%',
      flexDirection: 'row',
    },
  })

  return (
    <View style={styles.head} {...others}>
      {children}
    </View>
  )
}

export default TableHead
