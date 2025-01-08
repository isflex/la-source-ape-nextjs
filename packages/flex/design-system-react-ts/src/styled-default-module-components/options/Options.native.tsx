import React from 'react'
import { StyleSheet, View } from 'react-native'
import { OptionsProps } from './OptionsProps'

/**
 * Options Component
 * @param children {ReactNode} Children for Options
 */
const Options = ({ children }: OptionsProps): React.JSX.Element => {
  const styles = StyleSheet.create({
    options: {
      flexDirection: 'row',
      width: '100%',
      flex: 1,
    },
  })

  return <View style={styles.options}>{children}</View>
}

export default Options
