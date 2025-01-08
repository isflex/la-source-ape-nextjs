import generateUtilityClasses from '../../../mui/generateUtilityClasses/index.js'
import generateUtilityClass from '../../../mui/generateUtilityClass/index.js'

export interface ImageListItemClasses {
  /** Styles applied to the root element. */
  root: string
  /** Styles applied to an `img` element to ensure it covers the item. */
  img: string
  /** Styles applied to the root element if `variant="standard"`. */
  standard: string
  /** Styles applied to the root element if `variant="woven"`. */
  woven: string
  /** Styles applied to the root element if `variant="masonry"`. */
  masonry: string
  /** Styles applied to the root element if `variant="quilted"`. */
  quilted: string
}

export type ImageListItemClassKey = keyof ImageListItemClasses

export function getImageListItemUtilityClass(slot: string): string {
  return generateUtilityClass('imageListItem', slot)
}

const imageListItemClasses: ImageListItemClasses = generateUtilityClasses('imageListItem', ['root', 'img', 'standard', 'woven', 'masonry', 'quilted'])

export default imageListItemClasses
