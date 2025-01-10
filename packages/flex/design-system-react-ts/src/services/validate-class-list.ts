// import { default as styles, type Styles } from '@flex-design-system/framework'
import { default as styles, type Styles } from '@flex-design-system/framework'
// import { default as styles, type Styles } from '@flex-design-system/framework/main/all.module.scss'

const toClassNames = (arr: string[]) => arr.filter(Boolean).join(' ')
const validate = (classList: string[] | undefined) => {
  if (!classList) return null
  let _classList: string[] = []
  try {
    classList.map((className) => {
      if (!styles[className as keyof Styles]) return null
      _classList = [..._classList, styles[className as keyof Styles]]
    })
    return toClassNames(_classList)
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log('[ flex|modular|components ] Error ', error)
  }
}

export { validate }
