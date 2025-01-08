import Stylable from '../Stylable.js'
import Classable from '../Classable.js'

enum VariantStateEnum {
  PRIMARY,
  SECONDARY,
  TERTIARY,
  SUCCESS,
  INFO,
  WARNING,
  DANGER,
  DEBUG,
  FLEX_PINK,
  FLEX_PURPLE,
  FLEX_GREEN,
  FLEX_ORANGE,
}

/**
 * Variant State
 */
export class VariantState implements Stylable, Classable {
  constructor(private variantEnum: VariantStateEnum) {
    return
  }

  public static PRIMARY = new VariantState(VariantStateEnum.PRIMARY)

  public static SECONDARY = new VariantState(VariantStateEnum.SECONDARY)

  public static TERTIARY = new VariantState(VariantStateEnum.TERTIARY)

  public static SUCCESS = new VariantState(VariantStateEnum.SUCCESS)

  public static INFO = new VariantState(VariantStateEnum.INFO)

  public static WARNING = new VariantState(VariantStateEnum.WARNING)

  public static DANGER = new VariantState(VariantStateEnum.DANGER)

  public static DEBUG = new VariantState(VariantStateEnum.DEBUG)

  public static FLEX_PINK = new VariantState(VariantStateEnum.FLEX_PINK)

  public static FLEX_PURPLE = new VariantState(VariantStateEnum.FLEX_PURPLE)

  public static FLEX_GREEN = new VariantState(VariantStateEnum.FLEX_GREEN)

  public static FLEX_ORANGE = new VariantState(VariantStateEnum.FLEX_ORANGE)

  getClassName(): string {
    switch (this.variantEnum) {
      case VariantStateEnum.PRIMARY:
        return 'primary'
      case VariantStateEnum.SECONDARY:
        return 'secondary'
      case VariantStateEnum.TERTIARY:
        return 'tertiary'
      case VariantStateEnum.SUCCESS:
        return 'success'
      case VariantStateEnum.INFO:
        return 'info'
      case VariantStateEnum.WARNING:
        return 'warning'
      case VariantStateEnum.DANGER:
        return 'danger'
      case VariantStateEnum.DEBUG:
        return 'debug'
      case VariantStateEnum.FLEX_PINK:
        return 'flex-pink'
      case VariantStateEnum.FLEX_PURPLE:
        return 'flex-purple'
      case VariantStateEnum.FLEX_GREEN:
        return 'flex-green'
      case VariantStateEnum.FLEX_ORANGE:
        return 'flex-orange'
      default:
        return ''
    }
  }

  getStyle(): string {
    switch (this.variantEnum) {
      case VariantStateEnum.PRIMARY:
        return '#fe544b'
      case VariantStateEnum.SECONDARY:
        return '#009dcc'
      case VariantStateEnum.TERTIARY:
        return '#0055a4'
      case VariantStateEnum.SUCCESS:
        return '#009060'
      case VariantStateEnum.INFO:
        return '#109db9'
      case VariantStateEnum.WARNING:
        return '#f6b027'
      case VariantStateEnum.DANGER:
        return '#d42d02'
      case VariantStateEnum.DEBUG:
        return '#ed6638bf'
      case VariantStateEnum.FLEX_PINK:
        return '#c8007b'
      case VariantStateEnum.FLEX_PURPLE:
        return '#b86bff'
      case VariantStateEnum.FLEX_GREEN:
        return '#009060'
      case VariantStateEnum.FLEX_ORANGE:
        return '#f6b027'
      default:
        return ''
    }
  }
}

export interface VariantProps {
  variant?: VariantState
}
