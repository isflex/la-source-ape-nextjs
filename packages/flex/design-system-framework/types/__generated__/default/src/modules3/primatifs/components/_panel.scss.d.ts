export type Styles = {
  control: string;
  fa: string;
  flexinessRoot: string;
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
  isPrimary: string;
  isQuaternary: string;
  isSecondary: string;
  isSuccess: string;
  isTertiary: string;
  isTertiaryDark: string;
  isTertiaryLight: string;
  isWarning: string;
  isWhite: string;
  isWrapped: string;
  panel: string;
  panelBlock: string;
  panelHeading: string;
  panelIcon: string;
  panelList: string;
  panelTabs: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
