export type Styles = {
  content: string;
  flexinessRoot: string;
  isLarge: string;
  isLowerAlpha: string;
  isLowerRoman: string;
  isMedium: string;
  isNormal: string;
  isSmall: string;
  isUpperAlpha: string;
  isUpperRoman: string;
  tabs: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
