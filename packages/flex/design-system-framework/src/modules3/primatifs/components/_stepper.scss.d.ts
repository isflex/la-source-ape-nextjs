export type Styles = {
  animateFromRight: string
  animateFromTop: string
  flexinessRoot: string
  fromRight: string
  fromTop: string
  isActive: string
  isCurrent: string
  isDone: string
  placeHolderShimmer: string
  spinAround: string
  step: string
  stepper: string
}

export type ClassNames = keyof Styles

declare const styles: Styles

export default styles
