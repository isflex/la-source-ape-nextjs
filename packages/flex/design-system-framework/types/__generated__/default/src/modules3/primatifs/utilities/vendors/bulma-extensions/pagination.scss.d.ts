export type Styles = {
  isActive: string;
  isCentered: string;
  isCurrent: string;
  isDisabled: string;
  isFocused: string;
  isLarge: string;
  isMedium: string;
  isRight: string;
  isRounded: string;
  isSmall: string;
  pagination: string;
  paginationEllipsis: string;
  paginationLink: string;
  paginationList: string;
  paginationNext: string;
  paginationPrevious: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
