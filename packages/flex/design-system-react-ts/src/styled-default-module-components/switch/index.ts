// const getSwitch = async () => {
//   switch (process.env.FLEX_GATEWAY_MODULE_CSS) {
//   case 'default':
//     return import('./SwitchDefault').then((module) => module.default || module)
//   // case 'named':
//   //   return import('./SwitchNamed').then((module) =>  module.default || module)
//   // case 'shadow-dom':
//   //   return import('./SwitchShadowDom').then((module) => module.default || module)
//   default:
//     return null
//   }
// }
// const Switch = await getSwitch()

import { Switch } from './SwitchDefault.js'
export { Switch }
// import { Switch, Styles } from './SwitchDefault.js'
// export { Switch, type Styles }
