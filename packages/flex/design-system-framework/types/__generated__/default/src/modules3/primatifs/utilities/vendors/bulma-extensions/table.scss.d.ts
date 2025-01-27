export type Styles = {
  isAdmin: string;
  isBordered: string;
  isCobalt: string;
  isDanger: string;
  isDebug: string;
  isFlexGreen: string;
  isFlexOrange: string;
  isFlexPink: string;
  isFlexPurple: string;
  isFullwidth: string;
  isHoverable: string;
  isInfo: string;
  isNarrow: string;
  isPrimary: string;
  isQuaternary: string;
  isSecondary: string;
  isSelected: string;
  isStriped: string;
  isSuccess: string;
  isTertiary: string;
  isTertiaryDark: string;
  isTertiaryLight: string;
  isVcentered: string;
  isWarning: string;
  isWhite: string;
  table: string;
  tableContainer: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
