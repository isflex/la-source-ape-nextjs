import React from 'react'
import { StyleSheet } from 'react-native'
import { ProgressItemProps } from './ProgressItemProps'
import { View } from '../../view'

/**
 * Progress Item component - Only if stacked
 * @param percent {number} Progress percent
 * @param minPercent {number} Default min percent is 100
 * @param alert {AlertState} Progress alert variant (SUCCESS|INFO|WARNING|DANGER)
 */

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ProgressItem = ({ children, percent, minPercent = 0, alert, ...others }: ProgressItemProps): Promise<React.JSX.Element> => {
  const height = 6
  const percentWidth = percent || minPercent

  const styles = StyleSheet.create({
    progress: {
      width: `${`${percentWidth}%`}`,
      height: height,
      backgroundColor: alert?.getStyle() || '#fe544b',
    },
  })

  return (
    <View style={styles.progress} {...others}>
      {children}
    </View>
  )
}

export default ProgressItem
