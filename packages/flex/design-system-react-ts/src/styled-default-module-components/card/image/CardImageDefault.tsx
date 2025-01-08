'use client'

import React from 'react'
import classNames from 'classnames'
import { is, validate } from '../../../services/index.js'
import { camelCase } from 'lodash'
import { CardImageProps } from './CardImageProps.js'

// ///////////////////////////////////////////////////////////////////////////
// /!\ When typed-scss-modules --exportType default
import { default as styles, type Styles } from '@flex-design-system/framework'
// import styles from 'flex-design-system-framework/main/all.module.scss'
// import { type Styles } from '@flex-design-system/framework/main/all.module.scss'
// ///////////////////////////////////////////////////////////////////////////

/**
 * Card Image Component
 * @param src Image source
 * @param alt Alt attribute
 * @param className Additionnal CSS Classes
 * @param classList {array} Additionnal css classes
 * @param size Image Card size on horizontal align
 */
const CardImage = ({ src, alt, className, classList, size, ...others }: CardImageProps): React.JSX.Element => {
  const classes = classNames(
    styles.cardImage,
    // size && camelCase(is(`${size}`)),
    size && styles[camelCase(is(`${size}`)) as keyof Styles],
    className,
    validate(classList),
  )

  return (
    <div className={classes}>
      <figure className={styles.image} {...others}>
        <img {...{ src, alt }} />
      </figure>
    </div>
  )
}

export default CardImage
