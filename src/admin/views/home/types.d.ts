/* eslint-disable camelcase */
interface SubmitStatisticResposne extends BaseResponse {
  recent_submit_statistic: { count: number; date: string }[]
}
