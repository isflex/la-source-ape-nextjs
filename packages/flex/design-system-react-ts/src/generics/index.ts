import React from 'react'

export type GenericChildren = React.ReactNode

export type Styles = { [key: string]: unknown }

export type TargetElement = HTMLElement & {
  active?: boolean
  id?: string
}
