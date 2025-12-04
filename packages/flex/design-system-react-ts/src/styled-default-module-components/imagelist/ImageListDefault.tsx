/* eslint-disable no-console */

'use client'

import * as React from 'react'
import composeClasses from '../../mui/composeClasses/index.js'
import classNames  from 'classnames'
import { camelCase } from 'lodash'
import { getImageListUtilityClass } from './imageListClasses.js'
import ImageListContext from './ImageListContext.js'
import { ImageListProps } from './ImageListProps.js'
import { ImageListVariant } from './ImageListVariantEnum.js'
import { ImageListRootProps } from './ImageListRootProps.js'
import { ImageListRootMarkup } from './ImageListTagEnum.js'

// ///////////////////////////////////////////////////////////////////////////
// /!\ When typed-scss-modules --exportType default
import { default as styles, type Styles } from '@flex-design-system/framework'
// import { default as styles, type Styles } from '@flex-design-system/framework/main/all.module.scss'
// ///////////////////////////////////////////////////////////////////////////

const useUtilityClasses = (ownerState: ImageListProps) => {
  const { classes, variant } = ownerState

  const slots = {
    root: ['root', variant],
  }

  return composeClasses(slots, getImageListUtilityClass, classes)
}

const ImageListRoot = (props: ImageListRootProps): React.JSX.Element => {
  const { markup, ownerState, children, style, className } = props
  const Tag = markup && (markup in ImageListRootMarkup || Object.values(ImageListRootMarkup).includes(markup)) ? markup : 'ul'
  const rootStyle = (): React.CSSProperties => {
    return {
      display: 'grid',
      overflowY: 'auto',
      listStyle: 'none',
      padding: 0,
      // Add iOS momentum scrolling for iOS < 13.0
      WebkitOverflowScrolling: 'touch',
      ...(ownerState.variant === ImageListVariant.MASONRY && {
        display: 'block',
      }),
      ...style,
    }
  }

  return (
    <Tag
      style={{ ...rootStyle() }}
      className={classNames (className, styles.imageListRoot, styles[camelCase(`image-list-${ownerState.variant}`) as keyof Styles])}
    >
      {children}
    </Tag>
  )
}

// const ImageList = React.forwardRef(function ImageList(props, ref) {
const ImageList = React.forwardRef<unknown, ImageListProps>((props, ref) => {
  const {
    children,
    className,
    // cols = 2,
    rowHeight = 'auto',
    gap = 4,
    // style: styleProp,
    variant = ImageListVariant.STANDARD,
  } = props

  const contextValue = React.useMemo(() => ({ rowHeight, gap, variant }), [rowHeight, gap, variant])

  React.useEffect(() => {
    if (process.env.NODE_ENV !== 'production') {
      // Detect Internet Explorer 8+
      if (document !== undefined && 'objectFit' in document.documentElement.style === false) {
        console.error(
          ['MUI: ImageList v5+ no longer natively supports Internet Explorer.', 'Use v4 of this component instead, or polyfill CSS object-fit.'].join(
            '\n',
          ),
        )
      }
    }
  }, [])

  // Moved to framework
  // const styleRoot =
  //   variant === 'masonry'
  //     ? { columnCount: cols, columnGap: gap, ...styleProp }
  //     : { gridTemplateColumns: `repeat(${cols}, 1fr)`, gap, ...styleProp }

  // console.log('ImageList', styleRoot)

  const ownerState = { ...props, gap, rowHeight, variant }

  const classes = useUtilityClasses(ownerState)

  // console.log('ImageList', classes)

  return (
    <ImageListRoot
      markup={ImageListRootMarkup.UL}
      className={classNames (classes.root, className)}
      ref={ref}
      // style={styleRoot}
      ownerState={ownerState}
    >
      <ImageListContext.Provider value={contextValue}>{children}</ImageListContext.Provider>
    </ImageListRoot>
  )
})

export default ImageList
