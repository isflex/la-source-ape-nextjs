// @ts-nocheck

'use server'

import React from 'react'
import classNames from 'classnames'
import { InfoBlockActionProps } from './InfoBlockActionProps.js'
import { has } from '../../../services/index.js'
import { Button } from '../../button/index.js'
import { VariantState } from '../../../objects/facets/index.js'

/**
 * Info Block Action
 * @param children {ReactNode} Button text content
 * - -------------------------- WEB PROPERTIES -------------------------------
 * @param className {string} Additionnal CSS Classes
 */
const InfoBlockAction = async ({ className, children, onClick, ...others }: InfoBlockActionProps): Promise<React.JSX.Element> => {
  const classes = classNames('info-block-action', has('text-centered'), className)

  return (
    <div className={classes} {...others}>
      {children && typeof children.valueOf() === 'string' ? (
        <Button onClick={onClick} variant={VariantState.PRIMARY}>
          {children}
        </Button>
      ) : (
        children
      )}
    </div>
  )
}

export default InfoBlockAction
