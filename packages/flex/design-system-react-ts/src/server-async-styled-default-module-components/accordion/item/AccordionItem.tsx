import React from 'react'
import classNames from 'classnames'
import { nanoid } from 'nanoid'
import { AccordionItemProps, OnClickEvent, TargetElement } from './AccordionItemProps.js'
import { is } from '../../../services/index.js'

/**
 * Accordion Item Component
 * @param active {boolean} Active Accordion Item
 * @param className {string} Additionnal CSS Classes
 * @param children
 * @param defaultActive {boolean} Default Item Activated
 * @param id {string} id for accordion item
 * @param onClick {ClickEvent} onClick Event
 * @param disabled {boolean} Disabled AccordionItem
 * ================= NATIVE =================
 * @param headerItems {ReactNode} Header Items
 * @param bodyItems {ReactNode} Body Items
 */
const AccordionItem = ({ active, className, children, id, onClick, disabled, ...others }: AccordionItemProps): React.JSX.Element => {
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

  React.useEffect(() => {
    const e = ref.current
    if (!e) {
      return
    }
    const { floor, abs } = Math
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const firstChild = e.children[1].firstChild as HTMLElement
    const expandedInactive = floor(abs(e.clientHeight + firstChild?.clientHeight)).toString()
    const expandedActive = floor(abs(e.clientHeight)).toString()
    const collapsedInactive = floor(abs(e.clientHeight + 1)).toString()
    const collapsedActive = floor(abs(e.children[0].clientHeight)).toString()
    setExpandedHeight(isActive ? expandedActive : expandedInactive)
    setCollapsedHeight(isActive ? collapsedActive : collapsedInactive)
  }, [isActive])

  React.useEffect(() => {
    setIsActive(active || false)
  }, [active])

  const toggleAccordion = (e: OnClickEvent) => {
    const target = e.target as TargetElement
    if (target.closest('.is-toggle-excluded') && !target.closest('.toggle')) {
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

  const classes = classNames('accordion', className, isActive && is('active'))

  const idGenerated = nanoid()

  let childrenElement = null
  if (children) {
    childrenElement = Array.isArray(children)
      ? children.map((child, index: number) => {
          return React.cloneElement(child, {
            key: `article-${index}`,
            id: index === 0 ? `header-${idGenerated}` : `body-${idGenerated}`,
            onClick: (e: OnClickEvent) => index === 0 && !disabled && toggleAccordion(e),
          })
        })
      : children
  }

  return (
    <article className={classes} ref={ref} id={id || idGenerated} {...others} data-collapsed={collapsedHeight} data-expanded={expandedHeight}>
      {childrenElement}
    </article>
  )
}

export default AccordionItem
