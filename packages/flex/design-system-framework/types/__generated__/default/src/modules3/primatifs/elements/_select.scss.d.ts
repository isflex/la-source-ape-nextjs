export type Styles = {
  animateFromRight: string
  animateFromTop: string
  flexinessRoot: string
  fromRight: string
  fromTop: string
  isActive: string
  isAdmin: string
  isCobalt: string
  isDanger: string
  isDebug: string
  isDisabled: string
  isFlexGreen: string
  isFlexOrange: string
  isFlexPink: string
  isFlexPurple: string
  isFocused: string
  isFullwidth: string
  isHovered: string
  isInfo: string
  isLarge: string
  isLoading: string
  isMedium: string
  isMultiple: string
  isPrimary: string
  isQuaternary: string
  isRounded: string
  isSecondary: string
  isSmall: string
  isSuccess: string
  isTertiary: string
  isTertiaryDark: string
  isTertiaryLight: string
  isWarning: string
  isWhite: string
  placeHolderShimmer: string
  select: string
  spinAround: string
}

export type ClassNames = keyof Styles

declare const styles: Styles

export default styles
