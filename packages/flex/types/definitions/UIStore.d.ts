export declare type NavigationState = 'fullpage' | 'aside' | 'top' | 'minimised'
export declare type demoPageFile = string
import { i18n } from 'i18next'

// https://stackoverflow.com/questions/61120760/how-to-extend-material-ui-theme-with-typescript/61120868
// https://javascript.plainenglish.io/extend-material-ui-theme-in-typescript-a462e207131f

export declare interface AppContextInterface {
  theme: {
    typography?: {
      fontFamily?: string,
      htmlFontSize?: number,
      fontSize?: number
    },
    palette: {
      mode: 'light' | 'dark'
    }
  }
  language: FlexI18next['language'],
  debug: boolean,
  cssMode: 'CSS Modules' | 'Tailwind',
  overlayMode: boolean
}

export declare interface PrefetchInterface {
  prefetchData: {
    [href:string]: {
      prefecthUrl?: string,
      url?: string
    }
  }
}
// export declare type I18next = typeof I18next
export declare interface FlexI18next extends i18n {
  language: string
  resolvedLanguage: string
}
