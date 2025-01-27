export type Styles = {
  isFullheight: string;
  isLarge: string;
  isMedium: string;
  section: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
