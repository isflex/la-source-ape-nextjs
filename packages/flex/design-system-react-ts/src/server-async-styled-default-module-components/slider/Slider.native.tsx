import React, { useState, useEffect } from 'react'
import { StyleSheet, ScrollView, Dimensions, Text } from 'react-native'
import { SliderProps } from './SliderProps'
import { View } from '../view'

const width = Dimensions.get('screen')
const height = (width.width * 100) / 60 // 60%

/**
 * Slider component
 * @param children {ReactNode} Slider child
 */
const Slider = ({ children, ...others }: SliderProps): Promise<React.JSX.Element> => {
  const [activeItem, setActiveItem] = useState<number>(0)

  const styles = StyleSheet.create({
    slider: {
      width: width.width,
      height: height,
      maxHeight: 300,
    },
    content: {
      width: width.width,
      height: height,
      maxHeight: 300,
      resizeMode: 'cover',
    },
    dots: {
      flexDirection: 'row',
      position: 'absolute',
      bottom: 0,
      alignSelf: 'center',
      fontSize: 30,
    },
    textDots: {
      color: '#C2C2C2',
      fontSize: 30,
    },
    activeTextDot: {
      color: '#fff',
      fontSize: 30,
    },
  })

  useEffect(() => {
    // console.log('children => ', children)
  }, [])

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const changeHandler = ({ nativeEvent }: any) => {
    const slide = Math.ceil(nativeEvent.contentOffset.x / nativeEvent.layoutMeasurement.width)
    if (slide !== activeItem) {
      setActiveItem(slide)
    }
  }

  return (
    <View style={styles.slider} {...others}>
      <ScrollView onScroll={changeHandler} pagingEnabled showsHorizontalScrollIndicator={false} horizontal>
        {children
          ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
          React.Children.map(children, (child: any) =>
            React.cloneElement(child, {
              style: [child.props.style, styles.content],
            }),)
          : children}
      </ScrollView>
      <View style={styles.dots}>
        {children
          ? React.Children.map(children, (child: React.ReactNode, index: number) => (
            <Text key={index} style={index === activeItem ? styles.activeTextDot : styles.textDots}>
                •
            </Text>
          ))
          : children}
      </View>
    </View>
  )
}

export default Slider
