import React from 'react'
import classNames from 'classnames'
import { TimelineContentWebProps } from './TimelineContentProps.js'
import { Text, TextMarkup } from '../../text/index.js'
import { Link } from '../../link/index.js'
// import { Route, BrowserRouter } from 'react-router-dom'
// import { BrowserRouter } from 'react-router-dom'
// import { FlexBrowserRouter } from '@flexiness/domain-lib-flex-browser-router'

/**
 * Timeline Content Component
 * @param children {ReactNode} Use it if you want custom children for content
 * @param className {string} Additionnal CSS Classes
 * @param heading {string} Text heading
 * @param content {string} Text content
 * @param link {string} Url link
 * @param contentLink {string} Text for link
 */
const TimelineContent = ({ children, className, heading, content, link, contentLink, ...others }: TimelineContentWebProps): React.JSX.Element => {
  const classes = classNames('timeline-content', className)

  if (children) {
    return <div className={classes} {...others} />
  }

  return (
    <div className={classes} {...others}>
      {/* <BrowserRouter> */}
      {heading && (
        <Text className='heading' markup={TextMarkup.P}>
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
