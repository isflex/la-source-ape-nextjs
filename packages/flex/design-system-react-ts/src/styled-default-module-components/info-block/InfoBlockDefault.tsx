'use client'

import React from 'react'
import classNames from 'classnames'
import { validate } from '../../services/index.js'
import { Box, BoxContent } from '../box/index.js'
import { InfoBlockProps } from './InfoBlockProps.js'

// ///////////////////////////////////////////////////////////////////////////
// /!\ When typed-scss-modules --exportType default
// import { type Styles } from '@flex-design-system/framework'
// import { type Styles } from '@flex-design-system/framework/main/all.module.scss'
// ///////////////////////////////////////////////////////////////////////////

/**
 * Info Block Component
 * @param children {React.ReactNode} Children for Info Block
 * @param boxed {boolean} Boxed block
 * - -------------------------- WEB PROPERTIES -------------------------------
 * @param className {string} Additionnal CSS Classes
 */
const InfoBlock = ({ className, classList, boxed, children, ...others }: InfoBlockProps): React.JSX.Element => {
  if (boxed) {
    return (
      <Box>
        <BoxContent>
          <div className={classNames('info-block', className, validate(classList))} {...others}>
            {children}
          </div>
        </BoxContent>
      </Box>
    )
  }

  return (
    <div style={{ padding: '2.5rem' }}>
      <div className={classNames('info-block', className, validate(classList))} {...others}>
        {children}
      </div>
    </div>
  )
}

export default InfoBlock
