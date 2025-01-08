export type Styles = {
  animateFromRight: string;
  animateFromTop: string;
  flexinessRoot: string;
  fromRight: string;
  fromTop: string;
  isArrowEnd: string;
  isArrowStart: string;
  isPopoverActive: string;
  isPopoverBottom: string;
  isPopoverLeft: string;
  isPopoverRight: string;
  paragraph: string;
  placeHolderShimmer: string;
  popover: string;
  popoverContent: string;
  popoverTrigger: string;
  spinAround: string;
  suptitle: string;
  text: string;
  title: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
