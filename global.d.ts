declare interface BasePaginationRequest {
  page: number | Ref<number>
  perpage: number | Ref<number>
}

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

declare interface TagListResponse extends CommonPaginationResponse {
  tags: TagData[]
}

declare interface New {
  content: string
  created_at: string
  defunct: number
  id: number
  title: string
  top: number
  updated_at: string
}

declare interface Tag {
  id: number | ''
  name: string
  created_at?: string
  updated_at?: string
}

declare interface ProblemListItem {
  accepted: number
  id: number
  level: number
  solved: number
  status: number
  submit: number
  tags: Tag[]
  title: string
}
