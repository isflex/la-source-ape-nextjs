export type Styles = {
  breadcrumb: string;
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
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
