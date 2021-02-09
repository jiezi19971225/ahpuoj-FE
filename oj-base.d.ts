export declare global {
  declare interface BaseResponse<T = object> {
    message?: string
    show?: boolean
    data?: T
  }

  declare interface PaginationResponse {
    page: number
    perpage: number
    total: number
  }

  declare interface CommonPaginationResponse<T = object>
    extends BaseResponse<T>,
      PaginationResponse {}
}
