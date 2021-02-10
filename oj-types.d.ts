/* eslint-disable camelcase */
export declare global {
  declare interface CreatorInfo {
    username: string
  }

  declare interface User {
    id: number
    email: string
    username: string
    nick: string
    avatar: string
    submit: number
    solved: number
    defunct: number
    created_at: string
    updated_at: string
    is_compete_user: number
    role_id: number
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

  declare interface SolutionInfo extends Solution {
    avatar: string
    nick: string
    problem_title: string
    public: number
    username: string
  }

  declare interface Team {
    id: number
    name: string
    created_at: string
    updated_at: string
    is_deleted: string
    creator_id: number
    userinfos: User[]
  }

  declare interface Contest {
    id: number
    name: string
    end_time: string
    start_time: string
    description: string
    defunct: number
    private: number
    team_mode: number
    langmask: number
    created_at: string
    updated_at: string
    is_deleted: string
    creator_id: number
    problems: Problem[]
    users: User[]
    teams: Team[]
  }

  declare interface Series {
    id: number
    name: string
    description: string
    team_mode: number
    defunct: number
    created_at: string
    updated_at: string
    is_deleted: string
    creator_id: number
    contests: Contest[]
  }

  declare interface ContestDto extends Contest, CreatorInfo {}

  declare interface Reply {
    id: number
    issue_id: number
    user_id: number
    reply_id: number
    reply_user_id: number
    created_at: string
    updated_at: string
    content: string
    is_deleted: number
    status: number
  }

  declare interface ReplyInfoDto extends Reply {
    created_at: string
    updated_at: string
    username: string
    rnick: string
    user_nick: string
    avatar: string
    reply_count: number
    sub_replys: ReplyInfoDto[]
  }
  declare interface Issue {
    created_at: string
    id: number
    is_deleted: number
    problem_id: number
    replys: Reply[]
    title: string
    updated_at: string
    user_id: number
  }

  declare interface IssueInfoDto {
    avatar: string
    created_at: string
    id: number
    is_deleted: number
    nick: string
    problem_id: number
    ptitle: string | null
    reply_count: number
    replys: Reply[]
    title: string
    updated_at: string
    user_id: number
    username: number
  }
  declare interface LangListItem {
    name: string
    available: boolean
  }

  declare interface TagListResponse extends CommonPaginationResponse {
    tags: TagData[]
  }
  declare interface LangListResponse extends CommonPaginationResponse {
    languages: LangListItem[]
  }
}
