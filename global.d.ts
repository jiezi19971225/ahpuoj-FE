/* eslint-disable camelcase */
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

declare interface Problem {
  id: number
  title: string
  description: string
  level: number
  defunct: number
  submit: nunmber
  accepted: number
  solved: number
  hint: string
  sample_input: string
  sample_output: string
  input: string
  output: string
  memory_limit: number
  time_limit: number
  spj: number
  tags: Tag[]
  creator_id: number
  created_at: string
  updated_at: string
}

declare interface Solution {
  code_length: number
  contest_id: number
  in_date: string
  ip: string
  judger: string
  judgetime: string
  language: number
  lint_error: number
  memory: number
  num: number
  pass_rate: number
  problem_id: number
  result: number
  solution_id: number
  team_id: number
  time: number
  user_id: number
  valid: number
}
declare interface LangListItem {
  name: string
  available: boolean
}

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
declare interface LangListResponse extends CommonPaginationResponse {
  languages: LangListItem[]
}
