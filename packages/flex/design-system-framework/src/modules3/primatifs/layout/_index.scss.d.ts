export type Styles = {
  animateFromRight: string
  animateFromTop: string
  button: string
  container: string
  flexinessRoot: string
  fromRight: string
  fromTop: string
  hasBackground: string
  hasMixins: string
  hasOverlap: string
  hasOverlay: string
  hasPatternLight: string
  hero: string
  heroBack: string
  heroBody: string
  heroButtons: string
  isCentered: string
  isClippedToBottom: string
  isElastic: string
  isFullwidth: string
  isInfo: string
  isInstit: string
  isInverted: string
  isLarge: string
  isMedium: string
  isOverlapped: string
  isPrimary: string
  isSmall: string
  isTransparentOnly: string
  mainContent: string
  paragraph: string
  patternDark: string
  placeHolderShimmer: string
  section: string
  spinAround: string
  subtitle: string
  suptitle: string
  tag: string
  title: string
  toolbar: string
  toolbarGroup: string
  toolbarItem: string
  toolbarRow: string
  toolbarSpace: string
}

export type ClassNames = keyof Styles

declare const styles: Styles

export default styles
