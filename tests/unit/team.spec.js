import { generateRandomString } from './common'
import * as teamApi from '../../src/admin/api/teamts'

describe('teams crud', () => {
  let newRecord
  it('createTeam', async done => {
    const randomString = generateRandomString(10)
    await teamApi
      .createTeam({
        name: randomString,
      })
      .then(res => {
        newRecord = res.team
      })
      .catch(err => {
        done(err)
      })
    teamApi
      .getTeam(newRecord.id)()
      .then(res => {
        console.log(res)
        newRecord = res.team
        expect(res.team.name).toBe(randomString)
        done()
      })
      .catch(err => {
        done(err)
      })
  })
  it('editTeam', async done => {
    const randomString = generateRandomString(10)
    await teamApi.editTeam(newRecord.id)({
      name: randomString,
    })
    teamApi
      .getTeam(newRecord.id)()
      .then(res => {
        console.log(res)
        expect(res.team.name).toBe(randomString)
        done()
      })
      .catch(err => {
        done(err)
      })
  })
  it('addTeamUser', async done => {
    await teamApi.addTeamUser(newRecord.id)({
      userList: 'admin',
    })
    teamApi
      .getTeamUserList(newRecord.id)()
      .then(res => {
        console.log(res)
        expect(res.data[0].username).toBe('admin')
        done()
      })
      .catch(err => {
        done(err)
      })
  })
  it('getTeamList', async done => {
    teamApi
      .getTeamList({
        page: 1,
        perpage: 10,
      })
      .then(res => {
        expect(res.data[0].id).toBe(newRecord.id)
        done()
      })
      .catch(err => {
        done(err)
      })
  })
  it('deleteTeam', async done => {
    await teamApi.deleteTeam(newRecord.id)()
    teamApi
      .getTeam(newRecord.id)()
      .then(res => {
        done(res)
      })
      .catch(err => {
        done()
      })
  })
})
