export type Styles = {
  flexSlider: string;
  isActive: string;
  isDark: string;
  isOverflowHidden: string;
  sliderDot: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
