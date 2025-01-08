import React from 'react'
import { StyleSheet } from 'react-native'
import { TableThProps } from './TableThProps'
import { View, Text } from '../../'

/**
 * TableTh Component
 * @param children {ReactNode} children of table TH
 */
const TableTh = ({ children, ...others }: TableThProps): Promise<React.JSX.Element> => {
  const borderColor = '#f9f9f9'

  const styles = StyleSheet.create({
    tableTh: {
      flexDirection: 'column',
      flex: 1,
      backgroundColor: borderColor,
    },
    title: {
      fontSize: 14,
      fontWeight: '600',
      padding: 7,
    },
  })

  return (
    <View style={styles.tableTh} {...others}>
      <Text style={styles.title}>{String(children)}</Text>
    </View>
  )
}

export default TableTh
