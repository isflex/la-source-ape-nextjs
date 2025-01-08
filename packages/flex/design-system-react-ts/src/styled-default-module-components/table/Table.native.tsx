import React from 'react'
import { StyleSheet } from 'react-native'
import { TableProps } from './TableProps'
import { View } from '../view'

/**
 * Table Component
 * @param bordered {boolean} bordered table
 */
const Table = ({ children, bordered, ...others }: TableProps): React.JSX.Element => {
  const borderColor = '#f9f9f9'

  const styles = StyleSheet.create({
    table: {
      width: '100%',
      backgroundColor: 'transparent',
    },
    bordered: {
      borderWidth: 1,
      borderColor: borderColor,
    },
    noBorder: {
      borderWidth: 0,
      borderColor: 'transparent',
    },
  })

  return (
    <View style={[bordered && styles.bordered, !bordered && styles.noBorder, styles.table]} {...others}>
      {children}
    </View>
  )
}

export default Table
