import Classable from '../Classable.js'

/**
 * Loading Enum
 */
enum LoadingEnum {
  LOADING,
  LOADED,
}

/**
 * Loading
 */
export class Loading implements Classable {
  static readonly LOADING = new Loading(LoadingEnum.LOADING)

  static readonly LOADED = new Loading(LoadingEnum.LOADED)

  constructor(private loadingEnum: LoadingEnum) {
    return
  }

  getClassName(): string {
    switch (this.loadingEnum) {
      case LoadingEnum.LOADING:
        return 'loading'
      case LoadingEnum.LOADED:
        return 'loaded'
      default:
        return ''
    }
  }
}

export interface Loadable {
  loading?: Loading
}
