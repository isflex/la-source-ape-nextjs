export type Styles = {
  animateFromRight: string
  animateFromTop: string
  block: string
  delete: string
  flexinessRoot: string
  fromRight: string
  fromTop: string
  heading: string
  isLarge: string
  isMedium: string
  isSmall: string
  loader: string
  number: string
  placeHolderShimmer: string
  spinAround: string
}

export type ClassNames = keyof Styles

declare const styles: Styles

export default styles
