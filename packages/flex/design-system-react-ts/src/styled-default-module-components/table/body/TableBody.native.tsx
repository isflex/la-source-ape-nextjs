import React from 'react'
import { StyleSheet } from 'react-native'
import { TableBodyProps } from './TableBodyProps'
import { View } from '../../view'

/**
 * TableBody Component
 * @param children {ReactNode} Children of Table Body
 */
const TableBody = ({ children, ...others }: TableBodyProps): React.JSX.Element => {
  const styles = StyleSheet.create({
    body: {
      display: 'flex',
      flexDirection: 'column',
      flex: 1,
    },
  })

  return (
    <View style={styles.body} {...others}>
      {children}
    </View>
  )
}

export default TableBody
