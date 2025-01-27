export type Styles = {
  animateFromRight: string;
  animateFromTop: string;
  flexinessRoot: string;
  fromRight: string;
  fromTop: string;
  hoverColor: string;
  isCheckradio: string;
  isDescriptive: string;
  isInverted: string;
  placeHolderShimmer: string;
  spinAround: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
