import Stylable from '../Stylable.js'
import Classable from '../Classable.js'

enum TextColorEnum {
  PRIMARY,
  SECONDARY,
  TERTIARY,
}

/**
 * Text color Style
 */
export class TextStyle implements Stylable, Classable {
  constructor(private TextEnum: TextColorEnum) {
    return
  }

  public static PRIMARY = new TextStyle(TextColorEnum.PRIMARY)

  public static SECONDARY = new TextStyle(TextColorEnum.SECONDARY)

  public static TERTIARY = new TextStyle(TextColorEnum.TERTIARY)

  getClassName(): string {
    switch (this.TextEnum) {
      case TextColorEnum.PRIMARY:
        return 'text-primary'
      case TextColorEnum.SECONDARY:
        return 'text-secondary'
      case TextColorEnum.TERTIARY:
        return 'text-tertiary'
      default:
        return ''
    }
  }

  getStyle(): string {
    switch (this.TextEnum) {
      case TextColorEnum.PRIMARY:
        return '#fe544b'
      case TextColorEnum.SECONDARY:
        return '#109db9'
      case TextColorEnum.TERTIARY:
        return '#25465f'
      default:
        return ''
    }
  }
}

export interface TextVariantProps {
  textVariant?: TextStyle
}
