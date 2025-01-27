export type Styles = {
  animateFromRight: string;
  animateFromTop: string;
  container: string;
  flexinessRoot: string;
  fromRight: string;
  fromTop: string;
  isFluid: string;
  isFullhd: string;
  isFullwidth: string;
  isMaxDesktop: string;
  isMaxTablet: string;
  isMaxWidescreen: string;
  isMedium: string;
  isWidescreen: string;
  navbar: string;
  placeHolderShimmer: string;
  spinAround: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
