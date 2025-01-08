// @ts-nocheck

'use server'

import React from 'react'
import classNames from 'classnames'
import { SectionWebProps } from './SectionProps.js'
import { is } from '../../services/index.js'

/**
 * Section Component - Manages the main margins of the page and takes up all the available width.
 * @param className {string} Additionnal CSS Classes
 * @param skeleton
 * @param others
 */
const Section = async ({ className, skeleton, ...others }: SectionWebProps): Promise<React.JSX.Element> => {
  const [isLoading, setIsLoading] = React.useState<boolean>(skeleton || false)

  React.useEffect(() => {
    setIsLoading(skeleton || false)
  }, [skeleton])

  return <section className={classNames('section', className, isLoading ? is('loading') : is('loaded'))} {...others} />
}

export default Section
