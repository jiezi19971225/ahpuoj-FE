declare interface Response {
  message: string
}

declare interface PaginationResponse {
  Response
  data: any
  page: number
  perpage: number
  total: number
}
