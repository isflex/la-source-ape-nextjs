/* eslint-disable no-console */
/* eslint-disable camelcase */

import '@flex-design-system/framework/flexslider.scss'
import { modulo } from './Math.js'
import { animateAllNodesToLeftDelta, getLeft, moveAllNodesToLeft } from './Utils.js'

declare type ActivePage = HTMLDivElement | null
declare type CallBack = () => void
declare type PageCallBack = (i: number) => void
type Duration = number
type SliderEvent = TouchEvent | MouseEvent

/**
 * Scrolls to the active page
 * @param candidatePages All the pages
 * @param activePageNumber The active pages
 * @param doneCallback will be executed when active page move is done
 */
const showActivePage = function (candidatePages: HTMLDivElement[], activePageNumber: number, doneCallback: CallBack) {
  let activePage: ActivePage = null
  Array.from(candidatePages).map((sliderPage, index) => {
    if (index === activePageNumber) {
      activePage = sliderPage
      sliderPage.classList.add('is-active')
    } else {
      sliderPage.classList.remove('is-active')
    }
  })

  if (activePage) {
    // @ts-expect-error
    const left = -(activePage.offsetLeft - activePage.parentNode.offsetLeft)
    animateAllNodesToLeftDelta(candidatePages, left, doneCallback)
  }
}

/**
 * Update a slider dots container and mark the current page active
 * @param activePage The current page
 * @param sliderDotsContainer The container
 */
const showActiveSliderDot = function (activePageIndex: number, sliderDotsContainer: HTMLDivElement) {
  for (let index = 0; index < sliderDotsContainer.children.length; index++) {
    const sliderDot = sliderDotsContainer.children[index]
    if (index === activePageIndex) {
      sliderDot.classList.add('is-active')
    } else {
      sliderDot.classList.remove('is-active')
    }
  }
}

/**
 * Gets clientX variable from an event that can be a touch event or a mouse event
 * @param event
 * @returns {*}
 */
const getClientX = function (event: SliderEvent) {
  if (event instanceof TouchEvent && event.touches && event.touches[0]) {
    return event.touches[0].clientX
  } else if (event instanceof MouseEvent) {
    return event.clientX
  }
}

/**
 * Enable the drag and drop behavior on a pages container.
 *
 * @param sliderPagesContainer The page container HTML Element (Usually, has a data-slider-pages attribute)
 * @param activePageSupplier A function that returns the current slider page
 * @param pages All the pages
 * @param callbackWhenActivePageIsFound: function(page) => void : A call back that will be executed when a page is swiped to.
 */
const enableDragBehavior = function (
  sliderPagesContainer: HTMLDivElement,
  activePageSupplier: () => number,
  pages: HTMLDivElement[],
  callbackWhenActivePageIsFound: PageCallBack,
) {
  const unmovables = sliderPagesContainer.querySelectorAll('img, [data-expand-link]') as unknown as HTMLDivElement[]
  Array.from(unmovables).map((unmovable: HTMLDivElement) => {
    unmovable.addEventListener('dragstart', function (event: DragEvent) {
      event.preventDefault()
      event.stopPropagation()
    })
  })

  let dragging = false
  let start_x: number | null
  let lastEvent: SliderEvent
  const numberOfPages = pages.length
  let initialLeft: number

  const onDown = function (event: SliderEvent) {
    dragging = true
    start_x = getClientX(event) || null
    lastEvent = event
    initialLeft = getLeft(pages)
  }

  const onUp = function () {
    if (dragging) {
      // @ts-expect-error
      const delta_x = start_x - getClientX(lastEvent)

      if (callbackWhenActivePageIsFound) {
        if (delta_x <= -50 && activePageSupplier() > 0) {
          callbackWhenActivePageIsFound(activePageSupplier() - 1)
        } else if (delta_x >= 50 && activePageSupplier() < numberOfPages - 1) {
          callbackWhenActivePageIsFound(activePageSupplier() + 1)
        } else {
          callbackWhenActivePageIsFound(activePageSupplier())
        }
      }

      dragging = false
      start_x = null
      initialLeft = 0
    }
  }

  const onMove = function (event: SliderEvent) {
    if (dragging) {
      // @ts-expect-error
      moveAllNodesToLeft(sliderPagesContainer.children, initialLeft - (start_x - getClientX(event)))

      lastEvent = event
    }
  }

  sliderPagesContainer.addEventListener('mousedown', onDown)
  sliderPagesContainer.addEventListener('touchstart', onDown)

  sliderPagesContainer.addEventListener('mousemove', onMove)
  sliderPagesContainer.addEventListener('touchmove', onMove)

  document.addEventListener('mouseup', onUp)
  document.addEventListener('touchend', onUp)
}

/**
 * Creates dots elements
 * @param numberOfDots The number of dots to be created
 * @param sliderDotsContainer The HTML element that will contains the dots
 * @param pageChangeCallback The callback when a page is changed
 */
const createSliderDots = function (numberOfDots: number, sliderDotsContainer: HTMLDivElement[], pageChangeCallback: PageCallBack) {
  sliderDotsContainer[0].innerHTML = ''
  const fragment = document.createDocumentFragment()
  for (let i = 0; i < numberOfDots; i++) {
    const dot = document.createElement('div')
    dot.classList.add('slider-dot')
    dot.addEventListener('click', () => pageChangeCallback(i))
    fragment.appendChild(dot)
  }
  sliderDotsContainer[0].appendChild(fragment)
}

const watchSliderFromBeingRemoved = function (slider: HTMLDivElement, callback: CallBack) {
  const observer = new MutationObserver(function (mutationsList, observer) {
    mutationsList.map((mutation) => {
      if (mutation.removedNodes) {
        ;[].forEach.call(mutation.removedNodes, function (removedNode) {
          if (removedNode === slider) {
            callback()
            observer.disconnect()
          }
        })
      }
    })
  })

  observer.observe(slider.parentNode!, {
    childList: true,
    subtree: true,
  })
}

/**
 * Setup a slider
 * @param slider A html element (usually selected with data-slider)
 */
const setupSlider = function (slider: HTMLDivElement) {
  let activePageIndex = 0
  const leftArrows = slider.querySelectorAll('[data-slider-prev]') as unknown as HTMLDivElement[]
  const rightArrows = slider.querySelectorAll('[data-slider-next]') as unknown as HTMLDivElement[]
  const sliderPagesContainers = slider.querySelectorAll('[data-slider-pages]') as unknown as HTMLDivElement[]
  const sliderDotsContainer = slider.querySelectorAll('[data-slider-dots]') as unknown as HTMLDivElement[]
  const sliderTimer = slider.querySelector('data-slider-timer') as Element
  let numberOfPages = 1
  let moving = false
  let sliderPages: HTMLDivElement[]
  let timerInterval: ReturnType<typeof setInterval> | null = null
  const timerDurationDefault = 10000

  if (slider.getAttribute('data-slider-initialized') === 'true') {
    return
  }
  slider.setAttribute('data-slider-initialized', 'true')

  watchSliderFromBeingRemoved(slider, function () {
    if (timerInterval) {
      clearInterval(Number(timerInterval))
    }
  })

  const updateViewToActivePage = function () {
    if (!moving) {
      moving = true
      showActivePage(sliderPages, activePageIndex, () => (moving = false))
      showActiveSliderDot(activePageIndex, sliderDotsContainer[0])
    } else {
      setTimeout(updateViewToActivePage, 100)
    }
  }

  if (sliderTimer) {
    const durationAttribute: string | null = sliderTimer.getAttribute('duration')
    const getParsedDuration = durationAttribute !== null ? parseInt(durationAttribute) : null
    const duration: Duration = getParsedDuration || timerDurationDefault

    const enableTimer = (sliderTimer: Element, duration: Duration) => {
      timerInterval = setInterval(function () {
        activePageIndex = modulo(activePageIndex + 1, numberOfPages)
        updateViewToActivePage()
      }, duration)
    }

    enableTimer(sliderTimer, duration)

    slider.addEventListener('mouseenter', function () {
      if (timerInterval) {
        clearInterval(Number(timerInterval))
      }
    })

    slider.addEventListener('mouseleave', function () {
      enableTimer(sliderTimer, duration)
    })
  }

  if (sliderPagesContainers.length !== 1) {
    console.error('Slider should have exactly one data-slider-pages element ')
  } else {
    const sliderPagesContainer = sliderPagesContainers[0]
    sliderPages = sliderPagesContainer.querySelectorAll('[data-slider-page]') as unknown as HTMLDivElement[]
    numberOfPages = sliderPages.length

    createSliderDots(sliderPages.length, sliderDotsContainer, (pageIndex: number) => {
      activePageIndex = pageIndex
      updateViewToActivePage()
    })

    updateViewToActivePage()
    window.addEventListener('resize', updateViewToActivePage)

    enableDragBehavior(
      sliderPagesContainer,
      function () {
        return activePageIndex
      },
      sliderPages,
      function (newActivePageIndex: number) {
        activePageIndex = newActivePageIndex
        updateViewToActivePage()
      },
    )

    Array.from(leftArrows).map((leftArrow: HTMLDivElement) => {
      leftArrow.addEventListener('click', function (event: MouseEvent) {
        activePageIndex = modulo(activePageIndex - 1, numberOfPages)
        updateViewToActivePage()
        event.preventDefault()
        event.stopPropagation()
      })
    })

    Array.from(rightArrows).map((rightArrow: HTMLDivElement) => {
      rightArrow.addEventListener('click', function (event: MouseEvent) {
        activePageIndex = modulo(activePageIndex + 1, numberOfPages)
        updateViewToActivePage()
        event.preventDefault()
        event.stopPropagation()
      })
    })
  }
}

export { setupSlider }
