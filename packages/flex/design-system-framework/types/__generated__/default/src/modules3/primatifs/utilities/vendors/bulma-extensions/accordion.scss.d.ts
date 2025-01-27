export type Styles = {
  accordion: string;
  accordionBody: string;
  accordionContent: string;
  accordionHeader: string;
  accordions: string;
  button: string;
  isActive: string;
  isAdmin: string;
  isCobalt: string;
  isDanger: string;
  isDebug: string;
  isFlexGreen: string;
  isFlexOrange: string;
  isFlexPink: string;
  isFlexPurple: string;
  isInfo: string;
  isLarge: string;
  isMedium: string;
  isPrimary: string;
  isQuaternary: string;
  isSecondary: string;
  isSmall: string;
  isSuccess: string;
  isTertiary: string;
  isTertiaryDark: string;
  isTertiaryLight: string;
  isWarning: string;
  isWhite: string;
  tag: string;
  toggle: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
