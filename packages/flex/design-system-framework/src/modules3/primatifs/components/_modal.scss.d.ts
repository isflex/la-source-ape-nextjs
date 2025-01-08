export type Styles = {
  animateFromRight: string
  animateFromTop: string
  box: string
  boxContent: string
  flexinessRoot: string
  fromRight: string
  fromTop: string
  isActive: string
  isLarge: string
  isMedium: string
  isSmall: string
  modal: string
  modalBackground: string
  modalClose: string
  modalContent: string
  modalTitle: string
  placeHolderShimmer: string
  spinAround: string
}

export type ClassNames = keyof Styles

declare const styles: Styles

export default styles
