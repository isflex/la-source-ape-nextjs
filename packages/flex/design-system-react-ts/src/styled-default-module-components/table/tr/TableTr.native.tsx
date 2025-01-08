import React, { useState } from 'react'
import { StyleSheet, TouchableOpacity } from 'react-native'
import { TableTrProps } from './TableTrProps'
import { View, Text, TextLevel } from '../../'

/**
 * TableTr Component
 * @param children {ReactNode} Rows children
 * @param expandable {boolean} Lines can display additional information
 * @param expanded {ReactNode|string} Expended Table TR content
 */
const TableTr = ({ children, expandable, expanded, ...others }: TableTrProps): React.JSX.Element => {
  const [isExpanded, setIsExpended] = useState<boolean>(false)
  const borderColor = '#F1F1F1'

  const styles = StyleSheet.create({
    tableTr: {
      flexDirection: 'row',
      flex: 1,
      borderTopColor: borderColor,
      borderTopWidth: 1,
    },
    expendable: {
      width: '100%',
      backgroundColor: '#F8F8F8',
      padding: 10,
    },
  })

  const handleExpendedContent = () => {
    setIsExpended(!isExpanded)
  }

  if (expandable) {
    return (
      <View>
        <TouchableOpacity onPress={() => handleExpendedContent()} style={styles.tableTr} {...others}>
          {children}
        </TouchableOpacity>
        {isExpanded && expanded && typeof expanded.valueOf() === 'string' && (
          <View style={styles.expendable}>
            <Text level={TextLevel.LEVEL4}>{String(expanded)}</Text>
          </View>
        )}
        {isExpanded && expanded && React.isValidElement(expanded) && <View style={styles.expendable}>{expanded}</View>}
      </View>
    )
  }

  return (
    <View style={styles.tableTr} {...others}>
      {children}
    </View>
  )
}

export default TableTr
