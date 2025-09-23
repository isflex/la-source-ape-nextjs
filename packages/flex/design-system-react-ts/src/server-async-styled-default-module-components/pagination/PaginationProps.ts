export interface Pager {
  currentPage: number
  pageSize: number
  totalPages: number
  endPage: number
  pages: number[]
}

// import { type GenericChildren } from '../../generics/index.js'

/**
 * Pagination Interface
 */
export interface PaginationProps {
  count: number
  defaultPage?: number
  pageSize?: number
  onClick?: (pager: Pager) => void
  className?: string
  classList?: string[]
}
