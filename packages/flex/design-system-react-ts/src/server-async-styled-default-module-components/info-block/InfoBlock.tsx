'use server'

import React from 'react'
import classNames from 'classnames'
import { Box, BoxContent } from '../box/index.js'
import { InfoBlockProps } from './InfoBlockProps.js'

/**
 * Info Block Component
 * @param children {React.ReactNode} Children for Info Block
 * @param boxed {boolean} Boxed block
 * - -------------------------- WEB PROPERTIES -------------------------------
 * @param className {string} Additionnal CSS Classes
 */
const InfoBlock = async ({ className, boxed, children, ...others }: InfoBlockProps): Promise<React.ReactNode> => {
  if (boxed) {
    return (
      <Box>
        <BoxContent>
          <div className={classNames('info-block', className)} {...others}>
            {children}
          </div>
        </BoxContent>
      </Box>
    )
  }

  return (
    <div style={{ padding: '2.5rem' }}>
      <div className={classNames('info-block', className)} {...others}>
        {children}
      </div>
    </div>
  )
}

export default InfoBlock
