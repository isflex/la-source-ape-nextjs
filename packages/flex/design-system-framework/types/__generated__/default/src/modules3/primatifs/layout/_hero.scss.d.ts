export type Styles = {
  animateFromRight: string;
  animateFromTop: string;
  button: string;
  container: string;
  flexinessRoot: string;
  fromRight: string;
  fromTop: string;
  hasBackground: string;
  hasMixins: string;
  hero: string;
  heroBack: string;
  heroBody: string;
  heroButtons: string;
  isCentered: string;
  isInfo: string;
  isInstit: string;
  isLarge: string;
  isMedium: string;
  isOverlapped: string;
  isPrimary: string;
  isSmall: string;
  paragraph: string;
  patternDark: string;
  placeHolderShimmer: string;
  section: string;
  spinAround: string;
  subtitle: string;
  suptitle: string;
  tag: string;
  title: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
