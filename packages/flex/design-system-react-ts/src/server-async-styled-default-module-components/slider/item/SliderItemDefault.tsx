'use server'

import React from 'react'
import classNames from 'classnames'
import { validate } from '../../../services/index.js'
import { ColumnsItem } from '../../columns/index.js'
import { SliderItemProps } from './SliderItemProps.js'
// import { Fade } from 'react-awesome-reveal'

// ///////////////////////////////////////////////////////////////////////////
// /!\ When typed-scss-modules --exportType default
import { default as styles, type Styles } from '@flex-design-system/framework'
// import { default as styles, type Styles } from '@flex-design-system/framework/main/all.module.scss'
// ///////////////////////////////////////////////////////////////////////////

/**
 * Slider Item component
 * @param className {string} Additionnal css classes
 * @param children {ReactNode} Slider Item child
 * @param active {boolean} Default active item
 */
const SliderItem = async ({ children, active, className, classList, ...others }: SliderItemProps): Promise<React.ReactNode> => {
  const classes = classNames(active && styles.isActive, className, validate(classList))

  return (
    // <Slide direction='right'>
    //   <ColumnsItem size={12} className={classes} {...others} data-slider-page>
    //     {children}
    //   </ColumnsItem>
    // </Slide>
    // <Fade cascade={true} damping={0.25} triggerOnce={true} direction='right' duration={1000}>
    //   <ColumnsItem size={12} className={classes} {...others} data-slider-page>
    //     {children}
    //   </ColumnsItem>
    // </Fade>
    <ColumnsItem size={12} className={classes} {...others} data-slider-page>
      {children}
    </ColumnsItem>
  )
}

export default SliderItem
