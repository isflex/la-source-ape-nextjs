import React from 'react'

// eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
export type OnClickEvent = React.MouseEvent<Element> | unknown

/**
 * Click Event Interface
 */
export interface ClickEvent {
  (e: OnClickEvent): void
}
