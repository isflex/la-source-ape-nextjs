export type Styles = {
  animateFromRight: string;
  animateFromTop: string;
  box: string;
  button: string;
  column: string;
  container: string;
  flexinessRoot: string;
  fromRight: string;
  fromTop: string;
  hasWireframes: string;
  heroBody: string;
  isWireframe: string;
  mainContent: string;
  placeHolderShimmer: string;
  section: string;
  spinAround: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
