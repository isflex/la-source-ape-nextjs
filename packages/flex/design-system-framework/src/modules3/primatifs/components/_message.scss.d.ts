export type Styles = {
  button: string
  delete: string
  isAdmin: string
  isCobalt: string
  isDanger: string
  isDebug: string
  isFlexGreen: string
  isFlexOrange: string
  isFlexPink: string
  isFlexPurple: string
  isInfo: string
  isLarge: string
  isMedium: string
  isPrimary: string
  isQuaternary: string
  isSecondary: string
  isSmall: string
  isSuccess: string
  isTertiary: string
  isTertiaryDark: string
  isTertiaryLight: string
  isWarning: string
  isWhite: string
  message: string
  messageBody: string
  messageHeader: string
  tag: string
}

export type ClassNames = keyof Styles

declare const styles: Styles

export default styles
