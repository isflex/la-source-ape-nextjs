import React from 'react'
import { StyleSheet } from 'react-native'
import { SliderItemProps } from './SliderItemProps'
import { View } from '../../view'

/**
 * Slider Item component
 * @param children {ReactNode} Slider Item child
 * @param active {boolean} Default active item
 */
const SliderItem = ({ children, ...others }: SliderItemProps): Promise<React.JSX.Element> => {
  const styles = StyleSheet.create({
    sliderItem: {
      width: '100%',
    },
  })

  return (
    <View style={styles.sliderItem} {...others}>
      {children}
    </View>
  )
}

export default SliderItem
