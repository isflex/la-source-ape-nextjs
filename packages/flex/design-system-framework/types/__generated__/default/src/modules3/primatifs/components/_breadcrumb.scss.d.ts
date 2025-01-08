export type Styles = {
  animateFromRight: string;
  animateFromTop: string;
  breadcrumb: string;
  flexinessRoot: string;
  fromRight: string;
  fromTop: string;
  hasArrowSeparator: string;
  hasBulletSeparator: string;
  hasDotSeparator: string;
  hasSucceedsSeparator: string;
  icon: string;
  isActive: string;
  isCentered: string;
  isLarge: string;
  isMedium: string;
  isRight: string;
  isSmall: string;
  placeHolderShimmer: string;
  spinAround: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
