import Stylable from '../Stylable.js'
import Classable from '../Classable.js'

enum AlertStateEnum {
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
 * Alert State
 */
export class AlertState implements Stylable, Classable {
  constructor(private alertEnum: AlertStateEnum) {
    return
  }

  public static PRIMARY = new AlertState(AlertStateEnum.PRIMARY)

  public static SECONDARY = new AlertState(AlertStateEnum.SECONDARY)

  public static TERTIARY = new AlertState(AlertStateEnum.TERTIARY)

  public static SUCCESS = new AlertState(AlertStateEnum.SUCCESS)

  public static INFO = new AlertState(AlertStateEnum.INFO)

  public static WARNING = new AlertState(AlertStateEnum.WARNING)

  public static DANGER = new AlertState(AlertStateEnum.DANGER)

  public static DEBUG = new AlertState(AlertStateEnum.DEBUG)

  public static FLEX_PINK = new AlertState(AlertStateEnum.FLEX_PINK)

  public static FLEX_PURPLE = new AlertState(AlertStateEnum.FLEX_PURPLE)

  public static FLEX_GREEN = new AlertState(AlertStateEnum.FLEX_GREEN)

  public static FLEX_ORANGE = new AlertState(AlertStateEnum.FLEX_ORANGE)

  getClassName(): string {
    switch (this.alertEnum) {
      case AlertStateEnum.PRIMARY:
        return 'primary'
      case AlertStateEnum.SECONDARY:
        return 'secondary'
      case AlertStateEnum.TERTIARY:
        return 'tertiary'
      case AlertStateEnum.SUCCESS:
        return 'success'
      case AlertStateEnum.INFO:
        return 'info'
      case AlertStateEnum.WARNING:
        return 'warning'
      case AlertStateEnum.DANGER:
        return 'danger'
      case AlertStateEnum.DEBUG:
        return 'debug'
      case AlertStateEnum.FLEX_PINK:
        return 'flex-pink'
      case AlertStateEnum.FLEX_PURPLE:
        return 'flex-purple'
      case AlertStateEnum.FLEX_GREEN:
        return 'flex-green'
      case AlertStateEnum.FLEX_ORANGE:
        return 'flex-orange'
      default:
        return ''
    }
  }

  getStyle(): string {
    switch (this.alertEnum) {
      case AlertStateEnum.PRIMARY:
        return '#fe544b'
      case AlertStateEnum.SECONDARY:
        return '#009dcc'
      case AlertStateEnum.TERTIARY:
        return '#0055a4'
      case AlertStateEnum.SUCCESS:
        return '#009060'
      case AlertStateEnum.INFO:
        return '#109db9'
      case AlertStateEnum.WARNING:
        return '#f6b027'
      case AlertStateEnum.DANGER:
        return '#d42d02'
      case AlertStateEnum.DEBUG:
        return '#ed6638bf'
      case AlertStateEnum.FLEX_PINK:
        return '#c8007b'
      case AlertStateEnum.FLEX_PURPLE:
        return '#b86bff'
      case AlertStateEnum.FLEX_GREEN:
        return '#009060'
      case AlertStateEnum.FLEX_ORANGE:
        return '#f6b027'
      default:
        return ''
    }
  }
}

export interface AlertProps {
  alert?: AlertState
}
