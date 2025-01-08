import React from 'react'
import { StyleSheet } from 'react-native'
import { TableTdProps } from './TableTdProps'
import { View } from '../../view'

/**
 * Table TD Component
 * @param children {ReactNode} Table TD children
 */
const TableTd = ({ children, ...others }: TableTdProps): React.JSX.Element => {
  const styles = StyleSheet.create({
    table: {
      flexDirection: 'column',
      flex: 1,
      padding: 10,
    },
  })

  return (
    <View style={styles.table} {...others}>
      {children}
    </View>
  )
}

export default TableTd
