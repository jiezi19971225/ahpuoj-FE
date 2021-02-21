import dayjs from 'dayjs'
import { authToken, instance, generateRandomString } from './common'
import * as authApi from '../../src/user/api/authts'
import * as nologinApi from '../../src/user/api/nologints'
import * as userApi from '../../src/user/api/userts'
import * as contestApi from '../../src/admin/api/contestts'
import * as problemApi from '../../src/admin/api/problemts'

describe('news crud', () => {
  let testUsername
  let testPassword
  let testUserToken
  let testUserToken2
  it('创建测试用户', async done => {
    testUsername = generateRandomString(10)
    testPassword = generateRandomString(10)
    testEmail = `${generateRandomString(10)}@test.com`
    await authApi
      .register({
        email: testEmail,
        username: testUsername,
        nick: testUsername,
        password: testPassword,
        confirmpassword: testPassword,
      })
      .then(res => {
        testUserToken = res.token
        console.log('测试用户token:', testUserToken)
        done()
      })
      .catch(err => {
        done(err)
      })
    await authApi
      .register({
        email: testEmail,
        username: generateRandomString(10),
        nick: generateRandomString(10),
        password: testPassword,
        confirmpassword: testPassword,
      })
      .then(res => {
        testUserToken2 = res.token
        console.log('测试用户2token:', testUserToken2)
        done()
      })
      .catch(err => {
        done(err)
      })
  })
  let testProblem
  it('创建测试竞赛问题', async done => {
    const randomString = generateRandomString(10)
    await problemApi
      .createProblem({
        title: randomString,
        time_limit: 1,
        memory_limit: 128,
        description: '123',
        input: '123',
        output: '123',
        sample_input: '123',
        sample_output: '123',
        hint: '123',
        spj: 0,
        level: 1,
        tags: [],
      })
      .then(res => {
        testProblem = res.problem
      })
    problemApi
      .getProblem(testProblem.id)()
      .then(res => {
        console.log('创建测试问题', res)
        expect(res.problem.title).toBe(randomString)
        expect(res.problem.time_limit).toBe(1)
        expect(res.problem.memory_limit).toBe(128)
        expect(res.problem.description).toBe('123')
        expect(res.problem.input).toBe('123')
        expect(res.problem.output).toBe('123')
        expect(res.problem.sample_input).toBe('123')
        expect(res.problem.sample_output).toBe('123')
        expect(res.problem.hint).toBe('123')
        expect(res.problem.spj).toBe(0)
        expect(res.problem.level).toBe(1)
        done()
      })
      .catch(err => {
        done(err)
      })
  })

  it('给测试问题添加数据', async done => {
    const randomString = generateRandomString(10)
    const output = '2'
    await problemApi
      .addProblemData(testProblem.id)({
        filename: randomString,
      })
      .catch(err => {
        done(err)
      })
    await problemApi
      .editProblemData(
        testProblem.id,
        `${randomString}.out`
      )({
        content: output,
      })
      .catch(err => {
        done(err)
      })
    await problemApi
      .getProblemDataFile(testProblem.id, `${randomString}.out`)()
      .then(res => {
        expect(res.content).toBe('2')
        done()
      })
      .catch(err => {
        done(err)
      })
    done()
  })

  let testContest
  it('创建私有测试竞赛作业', async done => {
    const randomContestName = generateRandomString(10)
    const startTime = dayjs().add(5, 'second').format('YYYY-MM-DD HH:mm:ss')
    const endTime = dayjs().add(10, 'second').format('YYYY-MM-DD HH:mm:ss')
    await contestApi
      .createContest({
        name: randomContestName,
        start_time: startTime,
        end_time: endTime,
        problems: `${testProblem.id}`,
        description: '',
        langmask: 0,
        private: 1,
        team_mode: 0,
      })
      .then(res => {
        testContest = res.contest
        console.log('创建私有测试竞赛作业', testContest)
        done()
      })
      .catch(err => {
        done(err)
      })
  })

  it('为私有测试竞赛作业添加人员', async done => {
    await contestApi
      .addContestUser(testContest.id)({
        userList: `${testUsername}`,
      })
      .then(res => {
        console.log('为私有测试竞赛作业添加人员', res)
        done()
      })
      .catch(err => {
        done(err)
      })
  })

  it('未登录用户 比赛开始前 不可查看题目', done => {
    // 取消登录态
    instance.defaults.headers.Authorization = ''
    nologinApi
      .getContest(testContest.id)()
      .then(res => {
        console.log('未登录用户 比赛开始前 不可查看题目', res)
        expect(res.seeable).toBe(false)
        done()
      })
      .catch(err => {
        console.log(err)
      })
  })

  it('等待6s', async done => {
    setTimeout(() => {
      done()
    }, 6000)
  })

  it('未登录用户 比赛进行中 不可查看题目', done => {
    // 取消登录态
    instance.defaults.headers.Authorization = ''
    nologinApi
      .getContest(testContest.id)()
      .then(res => {
        console.log('未登录用户 比赛进行中 不可查看题目', res)
        expect(res.seeable).toBe(false)
        done()
      })
      .catch(err => {
        console.log(err)
      })
  })

  it('未授权用户 比赛进行中 不可以查看题目', done => {
    // 授权用户登录态
    instance.defaults.headers.Authorization = testUserToken2
    nologinApi
      .getContest(testContest.id)()
      .then(res => {
        console.log('未授权用户 比赛进行中 不可以查看题目', res)
        expect(res.seeable).toBe(false)
        done()
      })
      .catch(err => {
        done(err)
      })
  })

  it('授权用户 比赛进行中 可以查看题目', done => {
    // 授权用户登录态
    instance.defaults.headers.Authorization = testUserToken
    nologinApi
      .getContest(testContest.id)()
      .then(res => {
        console.log('授权用户 比赛进行中 可以查看题目', res)
        expect(res.seeable).toBe(true)
        done()
      })
      .catch(err => {
        done(err)
      })
  })

  it('授权用户 比赛进行中 可以提交评测', done => {
    // 授权用户登录态
    instance.defaults.headers.Authorization = testUserToken
    userApi
      .submitJudgeCode({
        language: 1,
        problem_id: testProblem.id,
        contest_id: testContest.id,
        num: 1,
        source:
          '#include <algorithm>↵#include <iostream>↵#include <queue>↵#include <string>↵#include <vector>↵using namespace std;↵int main() {↵	cout<<2;↵}',
      })
      .then(res => {
        console.log('授权用户 比赛进行中 可以提交评测', res)
        done()
      })
      .catch(err => {
        done(err)
      })
  })

  it('等待6s', async done => {
    setTimeout(() => {
      done()
    }, 6000)
  })

  it('未登录用户 比赛结束 可以查看题目', done => {
    // 取消登录态
    instance.defaults.headers.Authorization = ''
    nologinApi
      .getContest(testContest.id)()
      .then(res => {
        console.log('未登录用户 比赛结束 可以查看题目', res)
        expect(res.seeable).toBe(true)
        done()
      })
      .catch(err => {
        done(err)
      })
  })

  it('授权用户 比赛结束后 不可以提交评测', done => {
    // 授权用户登录态
    instance.defaults.headers.Authorization = testUserToken
    userApi
      .submitJudgeCode({
        language: 1,
        problem_id: testProblem.id,
        contest_id: testContest.id,
        num: 1,
        source:
          '#include <algorithm>↵#include <iostream>↵#include <queue>↵#include <string>↵#include <vector>↵using namespace std;↵int main() {↵	cout<<2;↵}',
      })
      .then(res => {
        done(res)
      })
      .catch(err => {
        console.log('授权用户 比赛结束后 不可以提交评测', err.response)
        done()
      })
  })
})
