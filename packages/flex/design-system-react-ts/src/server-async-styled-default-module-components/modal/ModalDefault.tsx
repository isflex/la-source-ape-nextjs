// @ts-nocheck

'use server'

import React from 'react'
import classNames from 'classnames'
import { is, validate } from '../../services/index.js'
import { camelCase } from 'lodash'
import { ModalProps } from './ModalProps.js'
import { Box, BoxContent } from '../box/index.js'
import { Button, ButtonMarkup } from '../button/index.js'
import { Text } from '../text/index.js'
import { ModalMarkup } from './ModalEnum.js'

// ///////////////////////////////////////////////////////////////////////////
// /!\ When typed-scss-modules --exportType default
import { default as styles, type Styles } from '@flex-design-system/framework'
// import { default as styles, type Styles } from '@flex-design-system/framework/main/all.module.scss'
// ///////////////////////////////////////////////////////////////////////////

/**
 * Modal Component
 * @param active {boolean} Activated Modal
 * @param title {string} Title Modal
 * @param content {string} Content text for modal
 * @param triggerContent {string} Trigger custom element
 * - -------------------------- WEB PROPERTIES -------------------------------
 * @param className {string} Additionnal css classes
 * @param classList {array} Additionnal css classes
 * @param triggerMarkup {ModalMarkup} h1|h2|h3|h4|h5|h6|p|span|div|button|a
 * @param triggerClassNames {string} Additionnal CSS Classes for trigger element
 * @param onClose {Function} Additionnal close custom function
 * @param onOpen {Function} Additionnal open custom function
 */
const Modal = async ({
  children,
  className,
  classList,
  active,
  title,
  content,
  triggerMarkup,
  triggerContent,
  triggerClassNames,
  ctaContent,
  ctaOnClick,
  onClose,
  onOpen,
  ...others
}: ModalProps): Promise<React.JSX.Element> => {
  const [display, setDisplay] = React.useState<boolean>(active || false)

  React.useEffect(() => {
    setDisplay(active || false)
  }, [active])

  const classes = classNames(styles.modal, (display || active) && styles[camelCase(is('active')) as keyof Styles], className, validate(classList))

  /**
   * key in Enum works only in TS or with number enum for JS
   * for string enum (as in this case) we need to use Object.values.includes for JS usage
   * string enum aren't reverse mapped so the first solution doesn't work
   */
  const TriggerTag = triggerMarkup && (triggerMarkup in ModalMarkup || Object.values(ModalMarkup).includes(triggerMarkup)) ? triggerMarkup : 'button'

  if (children) {
    return (
      <div>
        {triggerContent && (
          <TriggerTag
            onClick={(e: React.MouseEvent) => {
              setDisplay(true)
              if (onOpen) onOpen(e)
            }}
            className={triggerClassNames}
          >
            {triggerContent}
          </TriggerTag>
        )}
        <div className={classes} {...others}>
          <div className={styles.modalBackground}></div>
          <div className={styles.modalContent}>
            <Box>
              <BoxContent>
                <button
                  onClick={(e: React.MouseEvent) => {
                    setDisplay(false)
                    if (onClose) onClose(e)
                  }}
                  className={classNames(styles.modalClose, styles.isLarge)}
                  aria-label='close'
                ></button>
                <span>{children}</span>
              </BoxContent>
            </Box>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      {triggerContent && (
        <TriggerTag
          onClick={(e: React.MouseEvent) => {
            setDisplay(true)
            if (onOpen) onOpen(e)
          }}
          className={triggerClassNames}
        >
          {triggerContent}
        </TriggerTag>
      )}
      <div className={classes} {...others}>
        <div className={styles.modalBackground}></div>
        <div className={styles.modalContent}>
          <Box>
            <BoxContent>
              <button
                onClick={(e: React.MouseEvent) => {
                  setDisplay(false)
                  if (onClose) onClose(e)
                }}
                className={classNames(styles.modalClose, styles.isLarge)}
                aria-label='close'
              ></button>
              <div className={styles.modalTitle}>{title}</div>
              <Text>{content}</Text>
              <Button markup={ButtonMarkup.BUTTON} className={styles[camelCase(is('primary')) as keyof Styles]} onClick={ctaOnClick}>
                {ctaContent}
              </Button>
            </BoxContent>
          </Box>
        </div>
      </div>
    </div>
  )
}

export default Modal
