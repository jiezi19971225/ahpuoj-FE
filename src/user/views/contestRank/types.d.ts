/* eslint-disable camelcase */
interface RankListContestInfo {
  id: number
  name: string
  problem_count: number
}
interface RankListItemUserInfo {
  id: number
  username: string
  nick: string
}

interface RankListItem {
  ac_time: number[]
  solved: number
  team_id: number
  time: number
  user: RankListItemUserInfo
  wa_count: number[]
}

interface ContestRankListResponse {
  contest: RankListContestInfo
  message: boolean
  ranklist: RankListItem[]
  reason: string
  seeable: boolean
}
