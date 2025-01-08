export type Styles = {
  animateFromRight: string;
  animateFromTop: string;
  chatContent: string;
  chatMessage: string;
  chatMessageAvatar: string;
  chatMessageContent: string;
  chatMessages: string;
  chatWindow: string;
  chatWindowInput: string;
  dot: string;
  flexinessRoot: string;
  fromRight: string;
  fromTop: string;
  isMe: string;
  isPartner: string;
  isScrollable: string;
  isWaiting: string;
  placeHolderShimmer: string;
  spinAround: string;
  wave: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
