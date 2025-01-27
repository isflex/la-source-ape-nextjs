export type Styles = {
  is1: string;
  is10: string;
  is11: string;
  is12: string;
  is2: string;
  is3: string;
  is4: string;
  is5: string;
  is6: string;
  is7: string;
  is8: string;
  is9: string;
  isAncestor: string;
  isChild: string;
  isParent: string;
  isVertical: string;
  tile: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
