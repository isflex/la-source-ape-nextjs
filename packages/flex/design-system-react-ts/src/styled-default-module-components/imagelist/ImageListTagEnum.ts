export enum ImageListRootMarkup {
  UL = 'ul',
}

export enum ImageListItemRootMarkup {
  LI = 'li',
}

type MarkUps = ['ul', 'li'] | ['p', 'span']

export type ImageListRootMarkups = [MarkUps[0], MarkUps[1]]
