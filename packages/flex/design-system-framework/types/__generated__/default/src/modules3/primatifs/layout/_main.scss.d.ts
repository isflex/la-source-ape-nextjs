export type Styles = {
  animateFromRight: string;
  animateFromTop: string;
  flexinessRoot: string;
  fromRight: string;
  fromTop: string;
  hasOverlay: string;
  isFullwidth: string;
  mainContent: string;
  placeHolderShimmer: string;
  spinAround: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
