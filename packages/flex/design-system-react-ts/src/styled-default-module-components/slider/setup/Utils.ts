/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */

declare type CallBack = () => void

const fetchLeftValue = function (domElement: HTMLElement) {
  if (domElement.style.left) {
    return parseInt(domElement.style.left, 10)
  }

  return 0
}

const moveAllNodesToLeft = function (nodes: HTMLElement[], value: number) {
  for (let i = 0; i < nodes.length; i++) {
    const child = nodes[i]

    window.requestAnimationFrame((time) => {
      child.style.left = `${value}px`
    })
  }
}

const animateAllNodesToLeftDelta = function (nodes: HTMLElement[], value: number, doneCallback: CallBack) {
  const STEP_ANIMATION = 30

  for (let i = 0; i < nodes.length; i++) {
    const child = nodes[i]

    const leftTarget = value + fetchLeftValue(child)

    const animate = function (doneCallback: CallBack) {
      const currentLeftValue = fetchLeftValue(child)
      const sign = (leftTarget - currentLeftValue) / Math.abs(leftTarget - currentLeftValue)

      child.style.left = `${sign * STEP_ANIMATION + currentLeftValue}px`

      if (Math.abs(currentLeftValue - leftTarget) > STEP_ANIMATION) {
        requestAnimationFrame(function () {
          animate(doneCallback)
        })
      } else {
        child.style.left = `${leftTarget}px`
        if (doneCallback && i === nodes.length - 1) {
          doneCallback()
        }
      }
    }

    requestAnimationFrame(function () {
      animate(doneCallback)
    })
  }
}

const getLeft = function (nodes: HTMLElement[]) {
  if (nodes.length !== 0 && nodes[0].style.left) {
    return parseInt(nodes[0].style.left, 10)
  }

  return 0
}

export { fetchLeftValue, moveAllNodesToLeft, getLeft, animateAllNodesToLeftDelta }
