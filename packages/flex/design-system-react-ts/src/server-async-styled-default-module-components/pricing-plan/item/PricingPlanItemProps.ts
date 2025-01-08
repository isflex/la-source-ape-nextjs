import { Narrow } from '../../../objects/facets/index.js'
import { GenericChildren } from '../../../generics/index.js'

enum SpacingLevel {
  LEVEL1 = 1,
  LEVEL2 = 2,
  LEVEL3 = 3,
  LEVEL4 = 4,
  LEVEL5 = 5,
  LEVEL6 = 6,
  LEVEL7 = 7,
  LEVEL8 = 8,
  LEVEL9 = 9,
  LEVEL10 = 10,
  LEVEL11 = 11,
  LEVEL12 = 12,
}

type SpacingLevelType = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12

/**
 * Pricing Plan Item Interface
 */
export interface PricingPlanItemProps extends Narrow {
  children?: GenericChildren | string
  spacing?: SpacingLevel | SpacingLevelType
}

/**
 * Pricing Plan Item Web Interface
 */
export interface PricingPlanItemWebProps extends PricingPlanItemProps {
  className?: string
  classList?: string[]
}
