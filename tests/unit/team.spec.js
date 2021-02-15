import './common'
import * as teamApi from '../../src/admin/api/teamts'

const generateRandomString = length => {
  const pool = 'abcdefghijklmnopqrstuvwxyz0123456789'
  let res = ''
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < length; i++) {
    const randIndex = Math.ceil(Math.random() * 1000) % 36
    res += pool[randIndex]
  }
  console.log(res)
  return res
}

describe('teams crud', () => {
  let teamObject
  it('createTeam', async done => {
    const randomString = generateRandomString(10)
    teamApi
      .createTeam({
        name: randomString,
      })
      .then(res => {
        console.log(res)
        teamObject = res.team
        expect(res.team.name).toBe(randomString)
        done()
      })
      .catch(err => {
        done(err)
      })
  })
  it('editTeam', async done => {
    const randomString = generateRandomString(10)
    teamApi
      .editTeam(teamObject.id)({
        name: randomString,
      })
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
    await teamApi.addTeamUser(teamObject.id)({
      userList: 'admin',
    })
    teamApi
      .getTeamUserList(teamObject.id)()
      .then(res => {
        console.log(res)
        expect(res.data[0].username).toBe('admin')
        done()
      })
      .catch(err => {
        done(err)
      })
  })
  it('deleteTeam', async done => {
    await teamApi.deleteTeam(teamObject.id)()
    teamApi
      .getTeam(teamObject.id)()
      .then(res => {
        done(res)
      })
      .catch(err => {
        done()
      })
  })
})
