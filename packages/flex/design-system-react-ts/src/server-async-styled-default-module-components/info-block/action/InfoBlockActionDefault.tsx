'use server'

import React from 'react'
import classNames from 'classnames'
import { validate } from '../../../services/index.js'
import { InfoBlockActionProps } from './InfoBlockActionProps.js'
import { Button } from '../../button/index.js'
import { VariantState } from '../../../objects/facets/index.js'

// ///////////////////////////////////////////////////////////////////////////
// /!\ When typed-scss-modules --exportType default
import { default as styles, type Styles } from '@flex-design-system/framework'
// import { default as styles, type Styles } from '@flex-design-system/framework/main/all.module.scss'
// ///////////////////////////////////////////////////////////////////////////

/**
 * Info Block Action
 * @param children {ReactNode} Button text content
 * - -------------------------- WEB PROPERTIES -------------------------------
 * @param className {string} Additionnal CSS Classes
 */
const InfoBlockAction = async ({ className, classList, children, onClick, ...others }: InfoBlockActionProps): Promise<React.ReactNode> => {
  const classes = classNames('info-block-action', styles.hasTextCentered, className, validate(classList))

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
