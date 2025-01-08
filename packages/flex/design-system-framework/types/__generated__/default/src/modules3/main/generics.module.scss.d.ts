export type Styles = {
  boxHeader: string;
  dl: string;
  flexinessAsserted: string;
  flexinessRoot: string;
  iconList: string;
  isAlternate: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
