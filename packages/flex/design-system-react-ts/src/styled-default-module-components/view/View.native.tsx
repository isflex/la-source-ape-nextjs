import React from 'react'
import { View as ViewNative } from 'react-native'
import { ViewProps } from './ViewProps'

/**
 * View Component (DIV EQUIVALENT)
 * @param children {string} View child
 * @param style {object} View custom style
 */
const View = ({ children, style, ...others }: ViewProps): React.JSX.Element => {
  if (!children) {
    return <ViewNative style={style} {...others} />
  }

  return (
    <ViewNative style={style} {...others}>
      {children}
    </ViewNative>
  )
}

export default View
