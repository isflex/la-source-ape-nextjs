export type Styles = {
  animateFromRight: string
  animateFromTop: string
  container: string
  flexinessRoot: string
  fromRight: string
  fromTop: string
  hasMixins: string
  hasOverlap: string
  hasOverlay: string
  hasPatternLight: string
  isInfo: string
  isInverted: string
  isLarge: string
  isMedium: string
  isSmall: string
  isTransparentOnly: string
  patternDark: string
  placeHolderShimmer: string
  section: string
  spinAround: string
}

export type ClassNames = keyof Styles

declare const styles: Styles

export default styles
