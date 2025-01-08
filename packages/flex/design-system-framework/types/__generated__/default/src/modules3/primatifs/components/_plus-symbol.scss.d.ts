export type Styles = {
  animateFromRight: string;
  animateFromTop: string;
  flexinessRoot: string;
  fromRight: string;
  fromTop: string;
  isAdmin: string;
  isCobalt: string;
  isDanger: string;
  isDebug: string;
  isFlexGreen: string;
  isFlexOrange: string;
  isFlexPink: string;
  isFlexPurple: string;
  isInfo: string;
  isPrimary: string;
  isQuaternary: string;
  isSecondary: string;
  isSuccess: string;
  isTertiary: string;
  isTertiaryDark: string;
  isTertiaryLight: string;
  isWarning: string;
  isWhite: string;
  placeHolderShimmer: string;
  plusSymbol: string;
  spinAround: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
