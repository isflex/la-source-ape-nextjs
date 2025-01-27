export type Styles = {
  heading: string;
  image: string;
  is128x128: string;
  is16x16: string;
  is24x24: string;
  is32x32: string;
  is48x48: string;
  is64x64: string;
  is96x96: string;
  isAdmin: string;
  isCentered: string;
  isCobalt: string;
  isDanger: string;
  isDebug: string;
  isFlexGreen: string;
  isFlexOrange: string;
  isFlexPink: string;
  isFlexPurple: string;
  isIcon: string;
  isImage: string;
  isInfo: string;
  isOutlined: string;
  isPrimary: string;
  isQuaternary: string;
  isRtl: string;
  isSecondary: string;
  isSuccess: string;
  isTertiary: string;
  isTertiaryDark: string;
  isTertiaryLight: string;
  isWarning: string;
  isWhite: string;
  timeline: string;
  timelineContent: string;
  timelineHeader: string;
  timelineItem: string;
  timelineMarker: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
