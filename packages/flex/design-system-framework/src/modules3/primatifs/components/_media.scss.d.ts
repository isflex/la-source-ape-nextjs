export type Styles = {
  content: string
  control: string
  isLarge: string
  media: string
  mediaContent: string
  mediaLeft: string
  mediaRight: string
}

export type ClassNames = keyof Styles

declare const styles: Styles

export default styles
