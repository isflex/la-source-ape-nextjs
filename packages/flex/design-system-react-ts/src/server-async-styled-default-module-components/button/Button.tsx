'use server'

import React from 'react'
import classNames from 'classnames'
import { nanoid } from 'nanoid'
import { Link as RouterLink } from 'react-router'
import { is } from '../../services/index.js'
import { ButtonMarkup } from './ButtonEnum.js'
import { ButtonProps } from './ButtonProps.js'

/**
 * Button component
 * @param loading {boolean} Loading button
 * @param inverted {boolean} Inverted button
 * @param disabled {boolean} Disabled button
 * @param variant {VariantState} Button color : primary|secondary|tertiary
 * @param alert {AlertState} Alert variant color for Button
 * @param children {ReactNode} Button child
 * @param fullwidth {boolean} Fullwidth button
 * @param small {boolean} Small button
 * - -------------------------- WEB PROPERTIES -------------------------------
 * @param markup {ButtonMarkup} HTML element : button|input|a (ONLY FOR WEB)
 * @param className {string} Additionnal css classes (ONLY FOR WEB)
 * @param id {string} Custom id for button (ONLY FOR WEB)
 * @param to {string} Link
 */
const Button = async ({
  markup,
  loading,
  variant,
  href,
  id,
  fullwidth,
  children,
  className,
  inverted,
  alert,
  small,
  to,
  onClick,
  ...others
}: ButtonProps): Promise<React.AwaitedReactNode> => {
  const [isDisabled, setDisabled] = React.useState<boolean>(others.disabled || false)

  React.useEffect(() => {
    setDisabled(others.disabled || false)
  }, [others.disabled])

  const classes = classNames(
    'button',
    inverted && is('inverted'),
    loading && is(loading.getClassName()),
    variant && !alert && is(variant.getClassName()),
    alert && !variant && is(alert.getClassName()),
    fullwidth && is('fullwidth'),
    small && is('small'),
    className,
  )

  // const Tag = markup && (markup in ButtonMarkup || Object.values(ButtonMarkup).includes(markup)) ? markup : 'button'

  const idGenerated = nanoid()

  // if (Tag === 'button') {
  if (markup === ButtonMarkup.BUTTON) {
    return (
      <button id={id || idGenerated} className={classes} disabled={isDisabled} onClick={(e) => !isDisabled && onClick && onClick(e)} {...others}>
        {children}
      </button>
    )
  }
  // if (Tag === 'input') {
  if (markup === ButtonMarkup.INPUT) {
    return (
      <input
        id={id || idGenerated}
        className={classes}
        {...others}
        onClick={(e) => !isDisabled && onClick && onClick(e)}
        disabled={isDisabled}
        type={'submit'}
        value={`${children}`}
      />
    )
  }
  if (to && !isDisabled) {
    return (
      <RouterLink to={to} className={classes} {...others}>
        <span>{children}</span>
      </RouterLink>
    )
  }
  return (
    <a id={id || idGenerated} className={classes} href={href} onClick={(e) => !isDisabled && onClick && onClick(e)} {...others}>
      {children}
    </a>
  )
}

export default Button
