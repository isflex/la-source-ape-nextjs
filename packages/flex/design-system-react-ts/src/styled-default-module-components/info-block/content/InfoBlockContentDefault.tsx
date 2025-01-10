'use client'

import React from 'react'
import classNames from 'classnames'
import { validate } from '../../../services/index.js'
import { InfoBlockContentProps } from './InfoBlockContentProps.js'
import { Columns, ColumnsItem } from '../../columns/index.js'
import { Text } from '../../text/index.js'

// ///////////////////////////////////////////////////////////////////////////
// /!\ When typed-scss-modules --exportType default
import { default as styles, type Styles } from '@flex-design-system/framework'
// import { default as styles, type Styles } from '@flex-design-system/framework/main/all.module.scss'
// ///////////////////////////////////////////////////////////////////////////

/**
 * Info Block Content
 * @param children {ReactNode} Children content
 * - -------------------------- WEB PROPERTIES -------------------------------
 * @param className {string} Additionnal CSS Classes
 * @param size {number} Sizes available => 1 - 12
 */
const InfoBlockContent = ({ className, classList, size, children, ...others }: InfoBlockContentProps): React.JSX.Element => {
  const classes = classNames('info-block-content', styles.hasTextCentered, className, validate(classList))

  return (
    <div className={classes} {...others}>
      <Columns className={styles.isVcentered} centered>
        <ColumnsItem size={size || 8}>
          <div style={{ marginTop: '1rem', marginBottom: '2rem' }}>
            {children && typeof children.valueOf() === 'string' ? <Text>{String(children)}</Text> : children}
          </div>
        </ColumnsItem>
      </Columns>
    </div>
  )
}

export default InfoBlockContent
