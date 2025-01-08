import React from 'react'
import { StyleSheet } from 'react-native'
import { ColumnsProps } from './ColumnsProps'
import { View } from '../view'

/**
 * Columns Native Component
 * @param className {string} Additionnal CSS Classes
 * @param multiline {boolean} Multiline Columns
 * @param centered {boolean} Center columns
 * @param gapless {boolean} Delete margins between columns
 * @param marginSize {ColumnsSize} Delete margins between columns with Size (apply is-variable)
 * @param flex {boolean} Flex direction
 */
const Columns = ({ children, centered, gapless, marginSize, ...others }: ColumnsProps): React.JSX.Element => {
  const styles = StyleSheet.create({
    columns: {
      flexDirection: 'row',
      minWidth: '100%',
    },
    centered: {
      justifyContent: 'center',
    },
    gapless: {
      margin: 0,
      padding: 0,
    },
    variable: {
      padding: marginSize || 0,
    },
  })

  if (marginSize) {
    return (
      <View style={[styles.columns, centered]} {...others}>
        {children && marginSize
          ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
          React.Children.map(children, (child: any) =>
            React.cloneElement(child, {
              style: [child.props.style, styles.variable],
            }),)
          : children}
      </View>
    )
  }

  if (gapless) {
    return (
      <View style={[styles.columns, centered]} {...others}>
        {children && gapless
          ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
          React.Children.map(children, (child: any) =>
            React.cloneElement(child, {
              style: [child.props.style, styles.gapless],
            }),)
          : children}
      </View>
    )
  }

  return (
    <View style={[styles.columns, centered && styles.centered, gapless && styles.gapless]} {...others}>
      {children}
    </View>
  )
}

export default Columns
