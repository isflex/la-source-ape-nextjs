import Stylable from '../Stylable.js'
import Classable from '../Classable.js'

enum BackgroundEnum {
  WHITE,
}

/**
 * Background Style
 */
export class BackgroundStyle implements Stylable, Classable {
  constructor(private backgroundEnum: BackgroundEnum) {
    return
  }

  public static WHITE = new BackgroundStyle(BackgroundEnum.WHITE)

  getClassName(): string {
    switch (this.backgroundEnum) {
      case BackgroundEnum.WHITE:
        return 'background-white'
      default:
        return ''
    }
  }

  getStyle(): string {
    switch (this.backgroundEnum) {
      case BackgroundEnum.WHITE:
        return '#fff'
      default:
        return ''
    }
  }
}

export interface BackgroundProps {
  background?: BackgroundStyle
}
