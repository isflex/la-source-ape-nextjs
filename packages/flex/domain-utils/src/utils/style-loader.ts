'use client'

// https://github.com/module-federation/module-federation-examples/tree/master/css-isolation

// https://github.com/styled-components/styled-components/issues/887
// https://learn.microsoft.com/en-gb/microsoft-edge/devtools-guide-chromium/console/copilot-explain-console#the-explain-this-error-feature
// https://www.youtube.com/watch?v=vfVsAmNFLik

// https://www.npmjs.com/package/cssstyle
// https://www.npmjs.com/package/typescript-plugin-css-modules

// import { getFlexCSPNonce } from './get-csp-nonce.js'

// https://stackoverflow.com/a/49770779/10159170
const styles: Element[] = []
// const styles: Node[] = [];
// const styles: CSSStyleSheet[] = [];
// const styles: StyleSheet[] = [];
// const styles: Partial<CSSStyleDeclaration & { style: Node }>[] = [];
const containers: Record<string, HTMLElement> = {}
let isStandalone = false

// Create a shadow container with all styles and a placeholder for the app injection
export const createShadowContainer = (parentElementId: string) => {
  const shadowContainer = document.getElementById(parentElementId)
  if (shadowContainer != null) {
    // Block all styles coming from the light DOM
    shadowContainer.style.all = 'initial'
    shadowContainer.attachShadow({ mode: 'open', delegatesFocus: true })
    shadowContainer.shadowRoot?.append(...styles.map((style) => style.cloneNode(true)))
    // Create a body element so that reboot CSS rules work in the shadow DOM
    const body = document.createElement('body')
    body.setAttribute('nonce', globalThis.__webpack_nonce__ ?? '---CSP_NONCE---')
    // Create a placeholder for the React app
    const appPlaceholder = document.createElement('div')
    appPlaceholder.id = 'app-placeholder'
    appPlaceholder.setAttribute('nonce', globalThis.__webpack_nonce__ ?? '---CSP_NONCE---')
    body.appendChild(appPlaceholder)
    shadowContainer?.shadowRoot?.appendChild(body)
    containers[parentElementId] = shadowContainer
    return appPlaceholder
  }
  return null
}

export const deleteShadowContainer = (id: string) => {
  delete containers[id]
}

const insertStyle = (style: Element) => {
  // Update the style list for newly created shadow containers
  styles.push(style)

  if (isStandalone) {
    // console.log('insertStyle in head: ', style.innerHTML)
    style.setAttribute('nonce', globalThis.__webpack_nonce__ ?? '---CSP_NONCE---')
    document.head.appendChild(style)
  } else {
    // Update the style list for already existing shadow containers.
    // This will provide them with any lazy loaded styles.
    void Promise.resolve().then(() => {
      Object.values(containers).forEach((container: HTMLElement) => {
        // console.log('insertStyle in constainer shadowRoot !isStandalone', style.innerHTML)
        style.setAttribute('nonce', globalThis.__webpack_nonce__ ?? '---CSP_NONCE---')
        container.shadowRoot?.appendChild(style.cloneNode(true))
      })
    })
  }
}

// If this function is called it will make the style loader behave as it normally does
// and insert the styles into the head of the document instead of the shadow DOM
export const runStandalone = () => {
  isStandalone = true
  styles.forEach((style) => {
    // console.log('insertStyle in head: isStandalone 2', style.innerHTML)
    style.setAttribute('nonce', globalThis.__webpack_nonce__ ?? '---CSP_NONCE---')
    document.head.appendChild(style)
  })
}

export default insertStyle
