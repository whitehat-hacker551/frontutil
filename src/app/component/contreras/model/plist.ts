export interface IPage<T> {
  content: T[]
  pageable: IPageable
  totalPages: number
  totalElements: number
  last: boolean
  size: number
  number: number
  sort: ISort
  first: boolean
  numberOfElements: number
  empty: boolean
}

export interface IPageable {
  pageNumber: number
  pageSize: number
  sort: ISort
  offset: number
  paged: boolean
  unpaged: boolean
}

export interface ISort {
  sorted: boolean
  unsorted: boolean
  empty: boolean
}

