import { post } from '../../common/axios/request'

/** 生成比赛账号 */
export const generateCompeteAccount = post('/admin/generator/compete')
/** 生成用户账号 */
export const generateUserAccount = post('/admin/generator/user')
