export type Styles = {
  animateFromRight: string
  animateFromTop: string
  container: string
  flexinessRoot: string
  fromRight: string
  fromTop: string
  isClippedToBottom: string
  isElastic: string
  placeHolderShimmer: string
  spinAround: string
  toolbar: string
  toolbarGroup: string
  toolbarItem: string
  toolbarRow: string
  toolbarSpace: string
}

export type ClassNames = keyof Styles

declare const styles: Styles

export default styles
