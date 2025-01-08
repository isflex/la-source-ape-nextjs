import React, { lazy, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
const container = document.getElementById('root')
const root = createRoot(container!) // createRoot(container) if not using TypeScript

import ModulesDefault from './ModulesDefault'
import * as serviceWorker from './serviceWorker.js'

root.render(
  <React.StrictMode>
    <ModulesDefault isStandalone />
  </React.StrictMode>
)

// // eslint-disable-next-line @typescript-eslint/no-unsafe-return
// const ModulesDefault = lazy(() => import('./ModulesDefault'))

// root.render(
//   <React.StrictMode>
//     <Suspense fallback={<div>Loading...</div>}>
//       <ModulesDefault isStandalone />
//     </Suspense>
//   </React.StrictMode>,
// )

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
