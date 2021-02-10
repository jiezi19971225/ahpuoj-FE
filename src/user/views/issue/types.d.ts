/* eslint-disable camelcase */
interface IssueResponse extends CommonPaginationResponse {
  issue_enable: boolean
  replys: ReplyInfoDto[]
  issue: IssueInfoDto
}
