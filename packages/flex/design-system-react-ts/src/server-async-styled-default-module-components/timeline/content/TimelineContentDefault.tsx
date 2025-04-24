'use server'

import React from 'react'
import classNames from 'classnames'
import { validate } from '../../../services/index.js'
import { TimelineContentWebProps } from './TimelineContentProps.js'
import { Text, TextMarkup } from '../../text/index.js'
import { Link } from '../../link/index.js'
// import { Route, BrowserRouter } from 'react-router-dom'
// import { BrowserRouter } from 'react-router-dom'
// import { FlexBrowserRouter } from '@flexiness/domain-lib-flex-browser-router'

// ///////////////////////////////////////////////////////////////////////////
// /!\ When typed-scss-modules --exportType default
import { default as styles, type Styles } from '@flex-design-system/framework'
// import { default as styles, type Styles } from '@flex-design-system/framework/main/all.module.scss'
// ///////////////////////////////////////////////////////////////////////////

/**
 * Timeline Content Component
 * @param children {ReactNode} Use it if you want custom children for content
 * @param className {string} Additionnal CSS Classes
 * @param classList {array} Additionnal css classes
 * @param heading {string} Text heading
 * @param content {string} Text content
 * @param link {string} Url link
 * @param contentLink {string} Text for link
 */
const TimelineContent = async ({
  children,
  className,
  classList,
  heading,
  content,
  link,
  contentLink,
  ...others
}: TimelineContentWebProps): Promise<React.ReactNode> => {
  const classes = classNames(styles.timelineContent, className, validate(classList))

  if (children) {
    return <div className={classes} {...others} />
  }

  return (
    <div className={classes} {...others}>
      {/* <BrowserRouter> */}
      {heading && (
        <Text className={styles.heading} markup={TextMarkup.P}>
          {heading}
        </Text>
      )}
      {content && <Text markup={TextMarkup.P}>{content}</Text>}
      {link && (
        <Link removeLinkClass plain to={link}>
          {contentLink || link}
        </Link>
      )}
      {/* <Route path='/' />
      </BrowserRouter> */}
    </div>
  )
}

export default TimelineContent
