import React from 'react'
import { StyleSheet } from 'react-native'
import { Text } from '../text'
import { TileProps } from './TileProps'
import { View } from '../view'

/**
 * Tile Component
 * @param children {ReactNode} Tile Children
 */
const Tile = ({ children, ...others }: TileProps): React.JSX.Element => {
  const styles = StyleSheet.create({
    tile: {
      // alignSelf: 'baseline',
    },
  })
  return (
    <View style={styles.tile} {...others}>
      {Array.isArray(children) ? (
        children.map((child: React.ReactNode, index: number) =>
          (child && typeof child.valueOf() === 'string' ? <Text key={index}>{String(child)}</Text> : child),)
      ) : children && typeof children.valueOf() === 'string' ? (
        <Text>{String(children)}</Text>
      ) : (
        children
      )}
    </View>
  )
}

export default Tile
