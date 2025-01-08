import React from 'react'
import { StyleSheet } from 'react-native'
import { ProgressProps } from './ProgressProps'
import { View, Text, TextLevel } from '../'

/**
 * Progress component
 * @param children {ReactNode} Use Children it only if stacked progress
 * @param percent {number} Progress percent
 * @param alert {AlertState} Progress alert variant (SUCCESS|INFO|WARNING|DANGER)
 * @param stacked {boolean} Stacked progress
 * @param uniqueLegend {stringabsolute} Unique legend
 * @param firstExtremLegend {string} First extremity legend, only with secondExtremLegend property
 * @param secondExtremLegend {string} Second extremity legend, only with firstExtremLegend property
 */
const Progress = ({
  children,
  percent,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  alert,
  stacked,
  uniqueLegend,
  firstExtremLegend,
  secondExtremLegend,
  ...others
}: ProgressProps): Promise<React.JSX.Element> => {
  const height = 6
  const percentWidth = percent || 0

  const styles = StyleSheet.create({
    container: {},
    progress: {
      flexDirection: 'row',
      width: '100%',
      height: height,
      backgroundColor: '#f8f8f8',
      borderRadius: 15,
    },
    percent: {
      width: `${percentWidth}%`,
      height: height,
      backgroundColor: alert?.getStyle() || '#fe544b',
      borderRadius: 15,
    },
    progressItemFirst: {
      height: height,
      backgroundColor: alert?.getStyle() || '#fe544b',
      borderTopStartRadius: 6,
      borderBottomLeftRadius: 6,
    },
    progressItemSecond: {
      height: height,
      backgroundColor: alert?.getStyle() || '#fe544b',
      borderTopEndRadius: 6,
      borderBottomRightRadius: 6,
    },
    test: {
      width: 20,
      backgroundColor: '#333',
      height: 6,
    },
    uniqueLegend: {
      textAlign: 'center',
      paddingTop: 5,
      fontWeight: '500',
    },
    extremLegend: {
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingTop: 5,
      fontWeight: '500',
    },
  })

  if (stacked) {
    return (
      <View style={styles.progress} {...others}>
        {Array.isArray(children) &&
          children.map(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (child: any, index: number) =>
              (child &&
                child.type.name === 'ProgressItem' &&
                React.cloneElement(child, {
                  key: index,
                  style: [
                    index === 0 && styles.progressItemFirst,
                    index === children.length - 1 && styles.progressItemSecond,
                    { width: `${child.props.percent}%`, backgroundColor: child.props.alert.getStyle() },
                  ],
                })) ||
              child,
          )}
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.progress} {...others}>
        <View style={styles.percent}>{children}</View>
      </View>
      {uniqueLegend && (
        <Text style={styles.uniqueLegend} level={TextLevel.LEVEL3}>
          {uniqueLegend}
        </Text>
      )}
      {firstExtremLegend && secondExtremLegend && !uniqueLegend && (
        <View style={styles.extremLegend}>
          <Text level={TextLevel.LEVEL3}>{firstExtremLegend}</Text>
          <Text level={TextLevel.LEVEL3}>{secondExtremLegend}</Text>
        </View>
      )}
    </View>
  )
}

export default Progress
