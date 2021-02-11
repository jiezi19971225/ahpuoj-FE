interface ContestDetailDto extends Contest {
  problems: string
}

interface ContestResponse extends BaseResponse {
  contest: ContestDetailDto
}
