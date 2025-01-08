'use client'

import React from 'react'
import classNames from 'classnames'
import { is, validate } from '../../services/index.js'
import { camelCase } from 'lodash'
import { SectionWebProps } from './SectionProps.js'

// ///////////////////////////////////////////////////////////////////////////
// /!\ When typed-scss-modules --exportType default
import { default as styles, type Styles } from '@flex-design-system/framework'
// import styles from 'flex-design-system-framework/main/all.module.scss'
// import { type Styles } from '@flex-design-system/framework/main/all.module.scss'
// ///////////////////////////////////////////////////////////////////////////

/**
 * Section Component - Manages the main margins of the page and takes up all the available width.
 * @param className {string} Additionnal css classes
 * @param classList {array} Additionnal css classes
 * @param skeleton
 * @param others
 */
const Section = ({ className, classList, skeleton, ...others }: SectionWebProps): React.JSX.Element => {
  const [isLoading, setIsLoading] = React.useState<boolean>(skeleton || false)

  React.useEffect(() => {
    setIsLoading(skeleton || false)
  }, [skeleton])

  return (
    <section
      className={classNames(
        styles.section,
        isLoading ? styles[camelCase(is('loading')) as keyof Styles] : styles[camelCase(is('loaded')) as keyof Styles],
        className,
        validate(classList),
      )}
      {...others}
    />
  )
}

export default Section
