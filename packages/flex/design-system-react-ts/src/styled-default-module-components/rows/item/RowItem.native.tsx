import React from 'react'
import { StyleSheet } from 'react-native'
import { RowsItemProps } from './RowItemProps'
import { View } from '../../view'

/**
 * Rows Item Component
 * @param narrow {boolean} Align same elements horizontaly
 */
const RowItem = ({ children, narrow, ...others }: RowsItemProps): React.JSX.Element => {
  const styles = StyleSheet.create({
    rowItem: {
      flexGrow: (narrow && 0) || 1,
      padding: 5,
      flexShrink: 1,
    },
  })

  return (
    <View style={styles.rowItem} {...others}>
      {children}
    </View>
  )
}

export default RowItem
