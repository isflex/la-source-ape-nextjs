// https://github.com/module-federation/universe/issues/1183#issuecomment-2041629634

import React from 'react'
const useDynamicScript = (args: { url: string; nonce: string }) => {
  const [ready, setReady] = React.useState(false)
  const [failed, setFailed] = React.useState(false)

  React.useEffect(() => {
    if (!args.url || !args.nonce) {
      return
    }

    const element = document.createElement('script')

    element.src = args.url
    element.type = 'text/javascript'
    element.async = true
    element.nonce = args.nonce

    setReady(false)
    setFailed(false)

    element.onload = () => {
      // eslint-disable-next-line no-console
      console.log(`Dynamic Script Loaded: ${args.url}`)
      setReady(true)
    }

    element.onerror = () => {
      // eslint-disable-next-line no-console
      console.error(`Dynamic Script Error: ${args.url}`)
      setReady(false)
      setFailed(true)
    }

    document.head.appendChild(element)

    return () => {
      // eslint-disable-next-line no-console
      console.log(`Dynamic Script Removed: ${args.url}`)
      document.head.removeChild(element)
    }
  }, [args.url])

  return {
    ready,
    failed,
  }
}

export { useDynamicScript }
