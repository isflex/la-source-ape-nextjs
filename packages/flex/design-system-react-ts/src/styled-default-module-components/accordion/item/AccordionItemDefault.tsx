/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */

import React from 'react'
import classNames from 'classnames'
import { nanoid } from 'nanoid'
import { is, validate } from '../../../services/index.js'
import { camelCase } from 'lodash'
import { AccordionItemProps, OnClickEvent, TargetElement } from './AccordionItemProps.js'

// ///////////////////////////////////////////////////////////////////////////
// /!\ When typed-scss-modules --exportType default
import { default as styles, type Styles } from '@flex-design-system/framework'
// import { default as styles, type Styles } from '@flex-design-system/framework/main/all.module.scss'
// ///////////////////////////////////////////////////////////////////////////

/**
 * Accordion Item Component
 * @param active {boolean} Active Accordion Item
 * @param className {string} Additionnal css classes
 * @param classList {array} Additionnal css classes
 * @param children
 * @param defaultActive {boolean} Default Item Activated
 * @param id {string} id for accordion item
 * @param onClick {ClickEvent} onClick Event
 * @param onMouseEnter {React.MouseEventHandler<HTMLElement>} onMouseEnter Event
 * @param onMouseLeave {React.MouseEventHandler<HTMLElement>} onMouseLeave Event
 * @param disabled {boolean} Disabled AccordionItem
 * @param v2 {boolean} Rework of Accordion Style
 * ================= NATIVE =================
 * @param headerItems {ReactNode} Header Items
 * @param bodyItems {ReactNode} Body Items
 */
const AccordionItem = ({
  active,
  className,
  classList,
  children,
  id,
  onClick,
  onMouseEnter,
  onMouseLeave,
  disabled,
  v2 = false,
  ...others
}: AccordionItemProps): React.JSX.Element => {
  const ref = React.useRef<HTMLDivElement>(null)
  const [isActive, setIsActive] = React.useState<boolean>(active || false)
  const [expandedHeight, setExpandedHeight] = React.useState<string>()
  const [collapsedHeight, setCollapsedHeight] = React.useState<string>()

  // Faire à l'avance un pré-calcul de la hauteur de l'accordéon plié et déplié,
  // Ces infos sont enregistrées dans les data-attributs "data-collapsed" et "data-expanded".
  // Nécessaire quand l'accordion est consommé par un parent où un traitement supplémentaire
  // est requis comme un scrollTo par exemple. Dans ce cas là on transmet au component react
  // un événement onClick qui initie le scrollTo en amont de déclencher le toggle.
  // C'est-à-dire avant que l'accordion a été rendu dans son état déplié.

  React.useLayoutEffect(() => {
    const e = ref.current
    if (!e) {
      return
    }
    const { floor, abs } = Math
    const expanded = floor(
      abs(
        (e.children?.[0] as HTMLElement)?.clientHeight +
          (e.children?.[1]?.firstChild as HTMLElement)?.clientHeight +
          (e.children?.[2]?.firstChild as HTMLElement)?.clientHeight,
      ),
    ).toString()
    const collapsed = floor(abs((e.children?.[0] as HTMLElement)?.clientHeight)).toString()
    setExpandedHeight(expanded)
    setCollapsedHeight(collapsed)
  }, [isActive])

  React.useEffect(() => {
    setIsActive(active || false)
  }, [active])

  const toggleAccordion = (e: OnClickEvent) => {
    const target = e.target as TargetElement
    if (target.closest('.is-toggle-excluded') && !target.closest(styles.toggle)) {
      return false
    }
    setIsActive(!isActive)
    target.active = !isActive
    if (id) {
      target.id = id
    }
    if (typeof onClick === 'function') {
      onClick(e)
    }
  }

  const idGenerated = nanoid()

  const getId = (index: number) => {
    switch (true) {
      case index === 0: {
        return `header-${id || idGenerated}`
      }
      case index === 1: {
        return `body-${id || idGenerated}`
      }
      case index === 2: {
        return `action-${id || idGenerated}`
      }
      default:
        return `${id || idGenerated}`
    }
  }

  const classes = classNames(
    styles.accordion,
    className,
    validate(classList),
    isActive && styles[camelCase(is('active')) as keyof Styles],
    v2 && styles.version2,
  )

  // let childrenElement = null
  // if (children) {
  //   childrenElement = (children as React.ReactElement[]).map((child: React.ReactElement, index: number) => {
  //     return React.cloneElement(child, {
  //       key: `article-${index}`,
  //       onClick: (e: OnClickEvent) => index === 0 && !disabled && toggleAccordion(e),
  //       id: getId(index),
  //     })
  //   })
  // }

  let childrenElement = null
  if (children) {
    childrenElement = Array.isArray(children)
      ? children.map((child, index: number) => {
          return React.cloneElement(child, {
            key: `article-${index}`,
            id: getId(index),
            onClick: (e: OnClickEvent) => index === 0 && !disabled && toggleAccordion(e),
          })
        })
      : children
  }

  return (
    <article
      className={classes}
      ref={ref}
      id={id || idGenerated}
      {...others}
      data-collapsed={collapsedHeight}
      data-expanded={expandedHeight}
      onMouseEnter={(e) => {
        onMouseEnter && onMouseEnter(e)
      }}
      onMouseLeave={(e) => {
        onMouseLeave && onMouseLeave(e)
      }}
    >
      {childrenElement}
    </article>
  )
}

export default AccordionItem
