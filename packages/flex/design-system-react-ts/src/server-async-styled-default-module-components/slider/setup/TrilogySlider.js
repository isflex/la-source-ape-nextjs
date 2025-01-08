/* eslint-disable no-console */
/* eslint-disable camelcase */

import '@flex-design-system/framework/flexslider.scss'
import { modulo } from './Math.js'
import { animateAllNodesToLeftDelta, getLeft, moveAllNodesToLeft } from './Utils.js'

/**
 * Scrolls to the active page
 * @param candidatePages All the pages
 * @param activePageNumber The active pages
 * @param doneCallback will be executed when active page move is done
 */
const showActivePage = function (candidatePages, activePageNumber, doneCallback) {
  let activePage = null;
  [].forEach.call(candidatePages, function (sliderPage, index) {
    if (index === activePageNumber) {
      activePage = sliderPage
      sliderPage.classList.add('is-active')
    } else {
      sliderPage.classList.remove('is-active')
    }
  })

  if (activePage) {
    const left = (-(activePage.offsetLeft - activePage.parentNode.offsetLeft))

    animateAllNodesToLeftDelta(candidatePages, left, doneCallback)
  }
}

/**
 * Update a slider dots container and mark the current page active
 * @param activePage The current page
 * @param sliderDotsContainer The container
 */
const showActiveSliderDot = function (activePage, sliderDotsContainer) {
  for (let index = 0; index < sliderDotsContainer.children.length; index++) {
    const sliderDot = sliderDotsContainer.children[index]
    if (index === activePage) {
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
const getClientX = function (event) {
  if (event.touches && event.touches[0]) {
    return event.touches[0].clientX
  } else {
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
  sliderPagesContainer,
  activePageSupplier,
  pages,
  callbackWhenActivePageIsFound
) {
  const unmovables = sliderPagesContainer.querySelectorAll('img, [data-expand-link]');
  [].forEach.call(unmovables, function (unmovable) {
    unmovable.addEventListener('dragstart', function(event) {
      event.preventDefault()
      event.stopPropagation()
    })
  })

  let dragging = false
  let start_x
  let lastEvent
  const numberOfPages = pages.length
  let initialLeft

  const onDown = function (event) {
    dragging = true
    start_x = getClientX(event)
    lastEvent = event
    initialLeft = getLeft(pages)
  }

  const onUp = function () {
    if (dragging) {
      const delta_x = start_x - getClientX(lastEvent)

      if (callbackWhenActivePageIsFound) {
        if (delta_x <= -50 && activePageSupplier() > 0) {
          callbackWhenActivePageIsFound((activePageSupplier() - 1))
        } else if (delta_x >= 50 && activePageSupplier() < numberOfPages - 1) {
          callbackWhenActivePageIsFound((activePageSupplier() + 1))
        } else {
          callbackWhenActivePageIsFound(activePageSupplier())
        }

      }

      dragging = false
      start_x = null
      initialLeft = 0
    }
  }

  const onMove = function (event) {
    if (dragging) {
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
const createSliderDots = function (numberOfDots, sliderDotsContainer, pageChangeCallback) {
  sliderDotsContainer.innerHTML = ''

  for (let i = 0; i < numberOfDots; i++) {
    const dot = document.createElement('div')
    dot.classList.add('slider-dot')
    dot.addEventListener('click', () => pageChangeCallback(i))

    sliderDotsContainer.appendChild(dot)
  }
}

const watchSliderFromBeingRemoved = function(slider, callback) {
  const observer = new MutationObserver(function (mutationsList, observer) {
    [].forEach.call(mutationsList, function (mutation) {
      if (mutation.removedNodes) {
        [].forEach.call(mutation.removedNodes, function(removedNode) {
          if (removedNode === slider) {
            callback()
            observer.disconnect()
          }
        })
      }
    })
  })

  observer.observe(slider.parentNode, {
    childList: true,
    subtree: true
  })
}

/**
 * Setup a slider
 * @param slider A html element (usually selected with data-slider)
 */
const setupSlider = function (slider) {
  let activePage = 0
  const leftArrows = slider.querySelectorAll('[data-slider-prev]')
  const rightArrows = slider.querySelectorAll('[data-slider-next]')
  const sliderPagesContainers = slider.querySelectorAll('[data-slider-pages]')
  const sliderDotsContainer = slider.querySelectorAll('[data-slider-dots]')
  const sliderTimer = slider.querySelector('data-slider-timer')
  let numberOfPages = 1
  let moving = false
  let sliderPages
  let timerInterval = null
  const timerDurationDefault = 10000

  if (slider.getAttribute('data-slider-initialized') === 'true') {
    return
  }
  slider.setAttribute('data-slider-initialized', 'true')

  watchSliderFromBeingRemoved(slider, function() {
    if (timerInterval) {
      clearInterval(timerInterval)
    }
  })

  const updateViewToActivePage = function () {
    if (!moving) {
      moving = true
      showActivePage(sliderPages, activePage, () => moving = false);
      [].forEach.call(sliderDotsContainer, function (sliderDotsContainer) {
        showActiveSliderDot(activePage, sliderDotsContainer)
      })
    } else {
      setTimeout(updateViewToActivePage, 100)
    }
  }

  if (sliderTimer) {
    const durationAttribute = sliderTimer.getAttribute('duration')
    const duration = parseInt(durationAttribute) || timerDurationDefault

    const enableTimer = function (sliderTimer, duration) {
      timerInterval = setInterval(function () {
        activePage = modulo(activePage + 1, numberOfPages)
        updateViewToActivePage()
      }, duration)
    }

    enableTimer(sliderTimer, duration)

    slider.addEventListener('mouseenter', function() {
      if (timerInterval) {
        clearInterval(timerInterval)
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
    sliderPages = sliderPagesContainer.querySelectorAll('[data-slider-page]')
    numberOfPages = sliderPages.length;

    [].forEach.call(sliderDotsContainer, function (sliderDotsContainer) {
      createSliderDots(sliderPages.length, sliderDotsContainer, (page) => {
        activePage = page
        updateViewToActivePage()
      })
    })

    updateViewToActivePage()
    window.addEventListener('resize', updateViewToActivePage)

    enableDragBehavior(sliderPagesContainer, function () {
      return activePage
    }, sliderPages, function (newActivePage) {
      activePage = newActivePage
      updateViewToActivePage()
    });

    [].forEach.call(leftArrows, function (leftArrow) {
      leftArrow.addEventListener('click', function (event) {
        activePage = modulo(activePage - 1, numberOfPages)
        updateViewToActivePage()
        event.preventDefault()
        event.stopPropagation()
      })
    });

    [].forEach.call(rightArrows, function (rightArrow) {
      rightArrow.addEventListener('click', function (event) {
        activePage = modulo(activePage + 1, numberOfPages)
        updateViewToActivePage()
        event.preventDefault()
        event.stopPropagation()
      })
    })
  }
}

export { setupSlider }
