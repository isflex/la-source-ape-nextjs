import React from 'react'
import classNames from 'classnames'
import { CardContentProps } from './CardContentProps.js'
import { Title, TitleLevel } from '../../title/index.js'
import { Text } from '../../text/index.js'
import { Button, ButtonMarkup } from '../../button/index.js'
import { VariantState } from '../../../objects/facets/index.js'

/**
 * Card Content Component
 * @param children {ReacNode} Custom Card Content Children
 * @param titleSup {string} Add a sup title
 * @param title {string} Add a title
 * @param buttonText {string} if textButton, it will add a Button with content text
 * @param buttonVariant {VariantState} Add variant for Button - Default is primary
 * @param buttonClick {Function} Click event for Button
 * @param text {string} Content text of Card
 * - -------------------------- WEB PROPERTIES -------------------------------
 * @param className {string} Additionnal CSS Classes
 * @param buttonMarkup {ButtonMarkup} if Button, can change the button tag
 */
const CardContent = ({
  children,
  className,
  titleSup,
  titleSupLevel,
  title,
  titleLevel,
  buttonText,
  buttonMarkup,
  buttonVariant,
  buttonClick,
  text,
  textLevel,
  ...others
}: CardContentProps): React.JSX.Element => {
  if (children) {
    return (
      <div className={classNames('card-content', className)} {...others}>
        {children}
      </div>
    )
  }

  return (
    <div className={classNames('card-content', className)} {...others}>
      {titleSup && (
        <Text level={titleSupLevel} className='suptitle'>
          {titleSup}
        </Text>
      )}
      {title && <Title level={titleLevel ? titleLevel : TitleLevel.LEVEL3}>{title}</Title>}
      {text && <Text level={textLevel}>{text}</Text>}
      {buttonText && (
        <Button
          onClick={buttonClick}
          variant={buttonVariant ? buttonVariant : VariantState.PRIMARY}
          markup={buttonMarkup ? buttonMarkup : ButtonMarkup.BUTTON}
        >
          {buttonText}
        </Button>
      )}
    </div>
  )
}

export default CardContent