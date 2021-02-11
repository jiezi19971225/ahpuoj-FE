/* eslint-disable camelcase */
interface ProblemResponse extends BaseResponse {
  problem: Problem
}

interface ProblemDataResponse extends BaseResponse {
  files: {
    filename: string
    mod_time: string
    size: 0
  }[]
}
