/* eslint-disable camelcase */
interface UserAccount {
  username: string
  password: string
}

interface GenerateAccountResposne extends BaseResponse {
  info: string[]
  message: string
  users: UserAccount[]
}
