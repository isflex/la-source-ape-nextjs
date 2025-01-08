import React from 'react'
import { StyleSheet } from 'react-native'
import { ColumnsItemProps } from './ColumnsItemProps'
import { View } from '../../view'

/**
 * Columns Item Component - Columns Child
 * @param className {string} Additionnal CSS Classes
 * @param size {ColumnsSize} Size 1-12
 * @param mobileSize {ColumnsSize} Apply => is-size-mobile
 * @param tabletSize {ColumnsSize} Apply => is-size-tablet
 * @param desktopSize {ColumnsSize} Apply => is-size-desktop
 * @param narrow {boolean} Narrow column item
 */
const ColumnsItem = ({ children, size, ...others }: ColumnsItemProps): Promise<React.JSX.Element> => {
  const styles = StyleSheet.create({
    columnsItem: {
      flexDirection: 'column',
      flex: !size ? 12 : size,
    },
  })

  return (
    <View style={styles.columnsItem} {...others}>
      {children}
    </View>
  )
}

export default ColumnsItem
