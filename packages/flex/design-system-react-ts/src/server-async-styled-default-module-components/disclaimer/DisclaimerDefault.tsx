// @ts-nocheck

'use server'

import React from 'react'
import classNames from 'classnames'
import { is, validate } from '../../services/index.js'
// import { camelCase } from 'lodash'
import { DisclaimerWebProps } from './DisclaimerProps.js'
import { Accordion, AccordionItem, AccordionHeader, AccordionBody } from '../accordion/index.js'
import { Title, TitleLevel } from '../title/index.js'
import { Text } from '../text/index.js'

// ///////////////////////////////////////////////////////////////////////////
// /!\ When typed-scss-modules --exportType default
import { default as styles, type Styles } from '@flex-design-system/framework'
// import { default as styles, type Styles } from '@flex-design-system/framework/main/all.module.scss'
// ///////////////////////////////////////////////////////////////////////////

/**
 * Disclaimer component
 * @param children {React.ReactNode|string} Disclaimer Item Children
 * @param className {string} Additionnal css classes
 * @param classList {array} Additionnal css classes
 * @param title {string} Disclaimer Title
 * @param active {boolean} Active Disclaimer Bar
 */
const Disclaimer = async ({ children, className, classList, title, active, ...others }: DisclaimerWebProps): Promise<React.JSX.Element> => {
  const classes = classNames(styles.disclaimer, is('tri'), className, validate(classList))

  const wrapperClasses = classNames(styles.disclaimerHeader, styles.isGrouped, is('tri'))

  const classesBody = classNames(styles.accordionBody, styles.isClipped, is('tri'))

  const classesContent = classNames(styles.disclaimerContent, active && styles.isActive, styles.subtitle, is('tri'))

  return (
    <Accordion className={classes} {...others}>
      <AccordionItem>
        <AccordionHeader className={wrapperClasses} toggleBox='left' toggleBoxClass={is('bordered')}>
          <Title className={is('tri')} level={TitleLevel.LEVEL6}>
            {title}
          </Title>
        </AccordionHeader>
        <AccordionBody className={classesBody}>
          <div className={classesContent}>{children && typeof children.valueOf() === 'string' ? <Text>{String(children)}</Text> : children}</div>
        </AccordionBody>
      </AccordionItem>
    </Accordion>
  )
}

export default Disclaimer
