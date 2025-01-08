import generateUtilityClasses from '../../mui/generateUtilityClasses/index.js'
import generateUtilityClass from '../../mui/generateUtilityClass/index.js'

export interface ImageListClasses {
  /** Styles applied to the root element. */
  root: string
  /** Styles applied to the root element if `variant="masonry"`. */
  masonry: string
  /** Styles applied to the root element if `variant="quilted"`. */
  quilted: string
  /** Styles applied to the root element if `variant="standard"`. */
  standard: string
  /** Styles applied to the root element if `variant="woven"`. */
  woven: string
}

export type ImageListClassKey = keyof ImageListClasses

export function getImageListUtilityClass(slot: string): string {
  return generateUtilityClass('imageList', slot)
}

const imageListClasses: ImageListClasses = generateUtilityClasses('imageList', ['root', 'masonry', 'quilted', 'standard', 'woven'])

export default imageListClasses
