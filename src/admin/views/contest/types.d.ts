interface ContestDetailDto extends Contest {
  problems: string
}

interface ContestResponse extends BaseResponse {
  contest: ContestDetailDto
}
interface AllContestsResponse extends BaseResponse {
  contests: ContestDto[]
}

interface SeriesResposne extends BaseResponse {
  series: Series
}
