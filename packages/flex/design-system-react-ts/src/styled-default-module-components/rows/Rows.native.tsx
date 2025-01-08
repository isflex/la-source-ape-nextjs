import React from 'react'
import { StyleSheet } from 'react-native'
import { RowsProps } from './RowsProps'
import { View } from '../view'

/**
 * Rows Component
 * @param children {ReactNode} Rows children
 */
const Rows = ({ children, ...others }: RowsProps): React.JSX.Element => {
  const styles = StyleSheet.create({
    rows: {
      display: 'flex',
      flexDirection: 'column',
      flex: 1,
    },
  })

  return (
    <View style={styles.rows} {...others}>
      {children}
    </View>
  )
}

export default Rows
