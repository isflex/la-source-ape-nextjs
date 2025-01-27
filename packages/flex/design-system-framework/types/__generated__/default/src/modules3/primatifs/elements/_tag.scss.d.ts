export type Styles = {
  animateFromRight: string;
  animateFromTop: string;
  flexinessRoot: string;
  fromRight: string;
  fromTop: string;
  hasAddons: string;
  isDanger: string;
  isGapless: string;
  isInverted: string;
  isSecondary: string;
  isSuccess: string;
  isWarning: string;
  placeHolderShimmer: string;
  spinAround: string;
  tag: string;
  tags: string;
  useGrid: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
