import * as React from 'react'
import { StyleSheet } from 'react-native'
import { ProgressRadialProps } from './ProgressRadialProps'
import { AnimatedCircularProgress } from 'react-native-circular-progress'
import { View, Text, TextLevel } from '../../'

/**
 * Progress Radial component
 * @param percent {number} Progress percent
 * @param label {string} Custom label
 * @param description {string} Custom description
 * @param alert {AlertState} Progress alert variant (SUCCESS|INFO|WARNING|DANGER|TERTIARY)
 * @param full {boolean} Full progressRadial
 * @param disk {boolean} Disk ProgressRadial
 */
const ProgressRadial = ({
  percent,
  label,
  description,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  alert,
  full,
  disk,
  ...others
}: ProgressRadialProps): React.JSX.Element => {
  const color = alert?.getStyle() || '#009dcc'
  const backgroundColor = '#eee'
  const percentWidth = percent || 0

  const styles = StyleSheet.create({
    label: {
      textAlign: 'center',
      fontSize: 20,
      fontWeight: '500',
    },
    description: {
      textAlign: 'center',
      fontWeight: '400',
    },
    disk: {
      width: 100,
      height: 100,
      borderRadius: 50,
      backgroundColor: color,
    },
    labelDisk: {
      color: '#fff',
      textAlign: 'center',
      fontSize: 20,
      fontWeight: '500',
    },
    descriptionDisk: {
      color: '#fff',
      textAlign: 'center',
      fontWeight: '400',
    },
    alignCenter: {
      alignItems: 'center',
      justifyContent: 'center',
      flex: 1,
    },
  })

  if (disk) {
    return (
      <View style={styles.disk} {...others}>
        <View style={styles.alignCenter}>
          {label && typeof label.valueOf() === 'string' ? (
            <Text style={styles.labelDisk} level={TextLevel.LEVEL2}>
              {label || ''}
            </Text>
          ) : (
            label
          )}

          {description && typeof description.valueOf() === 'string' ? (
            <Text style={styles.descriptionDisk} level={TextLevel.LEVEL4}>
              {description || ''}
            </Text>
          ) : (
            description
          )}
        </View>
      </View>
    )
  }

  return (
    <View {...others}>
      <AnimatedCircularProgress
        size={100}
        width={5}
        fill={!full ? percentWidth : 100}
        tintColor={color}
        backgroundColor={backgroundColor}
        rotation={0}
      >
        {() => (
          <View style={styles.alignCenter}>
            {label && typeof label.valueOf() === 'string' ? (
              <Text style={styles.label} level={TextLevel.LEVEL2}>
                {label || ''}
              </Text>
            ) : (
              <View>{label}</View>
            )}

            {description && typeof description.valueOf() === 'string' ? (
              <Text style={styles.description} level={TextLevel.LEVEL4}>
                {description || ''}
              </Text>
            ) : (
              <View>{description}</View>
            )}
          </View>
        )}
      </AnimatedCircularProgress>
    </View>
  )
}

export default ProgressRadial
