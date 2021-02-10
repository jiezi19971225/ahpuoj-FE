/* eslint-disable camelcase */
interface PostIssueResponse extends BaseResponse {
  issue: Issue
}
interface IssueListResponse extends CommonPaginationResponse<IssueInfoDto[]> {
  issue_enable: boolean
}
