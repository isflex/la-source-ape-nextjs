// @ts-nocheck

'use server'

import React from 'react'
import classNames from 'classnames'
import { is, has } from '../../services/index.js'
import { ProductTourWebProps } from './ProductTourProps.js'
import { Icon, IconName, IconSize } from '../icon/index.js'

/**
 * Product Tour Component
 * @param children {ReactNode} Title child
 * @param className {string} Additionnal css classes
 * @param active {boolean} Display component
 * @param arrowDirection {ArrowDirection} UP|BOTTOM||LEFT|RIGHT - Display arrow
 * @param arrowAlign {ArrowAlign} ONE_FIFTH|ONE_QUARTER|ONE_THRID|TWO_FIFTHS|THREE_FIFTHS|
 * TWO_THIRDS|THREE_QUARTERS|FOUR_FIFTHS
 * @param closeable {boolean} Display close icon
 * @param avatarSrc {string} Display avatar if source
 * @param avatarDirection {AvatarDirection} LEFT|RIGHT
 */
const ProductTour = async ({
  children,
  className,
  active,
  arrowDirection,
  arrowAlign,
  closeable,
  avatarSrc,
  avatarDirection,
  ...others
}: ProductTourWebProps): Promise<React.JSX.Element> => {
  const [display, setDisplay] = React.useState<boolean>(active || false)

  React.useEffect(() => {
    setDisplay(active || false)
  }, [active])

  const classes = classNames('product-tour', display && is('active'), avatarDirection && has(`icon-${avatarDirection}`), className)

  return (
    <div className={classes} {...others}>
      {arrowDirection && <div className={classNames('arrow', is(arrowDirection), arrowAlign && is(arrowAlign))} />}
      {avatarSrc && (
        <span className={classNames('icon', is('medium'))}>
          <img className={is('rounded')} src={avatarSrc} alt={'avatar'} />
        </span>
      )}
      {closeable && (
        <div style={{ cursor: 'pointer' }} onClick={() => setDisplay(!display)}>
          <Icon size={IconSize.SMALL} name={IconName.UI_TIMES} className='close' />
        </div>
      )}
      <div className='product-tour-content'>{children}</div>
    </div>
  )
}

export default ProductTour
