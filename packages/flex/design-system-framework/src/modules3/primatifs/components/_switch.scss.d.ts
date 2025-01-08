export type Styles = {
  animateFromRight: string
  animateFromTop: string
  flexinessRoot: string
  fromRight: string
  fromTop: string
  hasSlice: string
  isDanger: string
  isDebug: string
  isInfo: string
  isInverted: string
  isSuccess: string
  isSwitch: string
  isWarning: string
  placeHolderShimmer: string
  spinAround: string
}

export type ClassNames = keyof Styles

declare const styles: Styles

export default styles
