'use server'

import React from 'react'
import { ListItemDescriptionProps } from './ListItemDescriptionProps.js'

/**
 * ListItem Component
 * @param className {string} Additionnal CSS Classes
 */

const ListItemDescription = async ({ children, className }: ListItemDescriptionProps): Promise<React.ReactNode> => {
  return <dd className={className}>{children}</dd>
}

export default ListItemDescription
