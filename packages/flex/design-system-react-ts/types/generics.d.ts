import React from "react"

export type GenericChildren =
  // React.JSX.Element | React.JSX.Element[] | string | number
  // React.FC<string | number | React.JSX.Element> | object
  React.ReactNode

export type Styles =
  { [key: string]: unknown }
