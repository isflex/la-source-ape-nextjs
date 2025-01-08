'use client'

import React from 'react'
import classNames from 'classnames'
import { validate } from '../../../services/index.js'
// import { camelCase } from 'lodash'
import { DisclaimerItemWebProps } from './DisclaimerItemProps.js'

// ///////////////////////////////////////////////////////////////////////////
// /!\ When typed-scss-modules --exportType default
import { default as styles } from '@flex-design-system/framework'
// import { default as styles, type Styles } from '@flex-design-system/framework'
// import styles from 'flex-design-system-framework/main/all.module.scss'
// import { type Styles } from '@flex-design-system/framework/main/all.module.scss'
// ///////////////////////////////////////////////////////////////////////////

/**
 * Disclaimer Item component
 * @param children {ReactNode} Diclaimer Item Children
 * @param className {string} Additionnal css classes
 * @param classList {array} Additionnal css classes
 */
const DisclaimerItem = ({ className, classList, ...others }: DisclaimerItemWebProps): React.JSX.Element => {
  const classes = classNames(styles.disclaimerItem, className, validate(classList))

  return <div className={classes} {...others} />
}

export default DisclaimerItem
