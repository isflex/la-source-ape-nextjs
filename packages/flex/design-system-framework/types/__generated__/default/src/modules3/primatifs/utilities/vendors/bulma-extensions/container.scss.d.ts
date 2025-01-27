export type Styles = {
  container: string;
  isFluid: string;
  isFullhd: string;
  isMaxDesktop: string;
  isMaxTablet: string;
  isMaxWidescreen: string;
  isWidescreen: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
