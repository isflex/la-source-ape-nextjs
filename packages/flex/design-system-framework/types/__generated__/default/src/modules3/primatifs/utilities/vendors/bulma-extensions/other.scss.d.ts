export type Styles = {
  block: string;
  delete: string;
  heading: string;
  isLarge: string;
  isMedium: string;
  isSmall: string;
  loader: string;
  number: string;
  spinAround: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
