import React from 'react'
import { StyleSheet } from 'react-native'
import { TagListProps } from './TagListProps'
import { View } from '../../view'

/**
 * Tag List Component
 * @param children {ReactNode} Children Tag List
 */
const TagList = ({ children, ...others }: TagListProps): Promise<React.JSX.Element> => {
  const styles = StyleSheet.create({
    tagList: {
      width: '100%',
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
  })

  return (
    <View style={styles.tagList} {...others}>
      {children}
    </View>
  )
}

export default TagList
