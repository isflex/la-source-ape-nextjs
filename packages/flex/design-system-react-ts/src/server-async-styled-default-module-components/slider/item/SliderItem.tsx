'use server'

import React from 'react'
import classNames from 'classnames'
import { ColumnsItem } from '../../columns/index.js'
import { SliderItemProps } from './SliderItemProps.js'
import { is } from '../../../services/index.js'

/**
 * Slider Item component
 * @param className {string} Additionnal css classes
 * @param children {ReactNode} Slider Item child
 * @param active {boolean} Default active item
 */
const SliderItem = async ({ children, active, className, ...others }: SliderItemProps): Promise<React.AwaitedReactNode> => {
  const classes = classNames(active && is('active'), className)

  return (
    <ColumnsItem size={12} className={classes} {...others} data-slider-page>
      {children}
    </ColumnsItem>
  )
}

export default SliderItem
