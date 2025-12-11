import React from 'react'
import { DotLottieReact, setWasmUrl } from '@lottiefiles/dotlottie-react'
setWasmUrl(`/animations/lottie/dotlottie-player.wasm`)

const SuccessCelebration = () => {
  return (
    <DotLottieReact
      src="/animations/lottie/success_celebration.lottie"
      loop
      autoplay
    />
  )
}

export { SuccessCelebration }
