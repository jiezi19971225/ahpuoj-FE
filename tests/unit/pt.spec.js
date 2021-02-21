import { generateRandomString } from './common'
import * as problemApi from '../../src/admin/api/problemts'
import * as tagApi from '../../src/admin/api/tagts'

let newTagRecord
describe('tags crud', () => {
  it('createTag', async done => {
    const randomString = generateRandomString(10)
    tagApi
      .createTag({
        name: randomString,
      })
      .then(res => {
        newTagRecord = res.tag
        expect(res.tag.name).toBe(randomString)
        done()
      })
      .catch(err => {
        done(err)
      })
  })
  it('editTag', async done => {
    const randomString = generateRandomString(10)
    tagApi
      .editTag(newTagRecord.id)({
        name: randomString,
      })
      .then(res => {
        newTagRecord = res.tag
        expect(res.tag.name).toBe(randomString)
        done()
      })
      .catch(err => {
        done(err)
      })
  })
})

describe('prlblems crud', () => {
  let newRecord
  let editedRecord
  it('createProblem', async done => {
    const randomString = generateRandomString(10)
    const randomTagString = generateRandomString(10)
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
        tags: [randomTagString, newTagRecord.id],
      })
      .then(res => {
        console.log(res)
        newRecord = res.problem
      })
      .catch(err => {
        done(err)
      })
    problemApi
      .getProblem(newRecord.id)()
      .then(res => {
        console.log(res)
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
        expect(res.problem.tags.length).toBe(2)
        done()
      })
      .catch(err => {
        done(err)
      })
  })
  it('editProblem', async done => {
    const randomString = generateRandomString(10)
    const randomTagString = generateRandomString(10)
    await problemApi.editProblem(newRecord.id)({
      title: randomString,
      time_limit: 2,
      memory_limit: 256,
      description: '456',
      input: '456',
      output: '456',
      sample_input: '456',
      sample_output: '456',
      hint: '456',
      spj: 0,
      level: 0,
      tags: [randomTagString],
    })
    problemApi
      .getProblem(newRecord.id)()
      .then(res => {
        console.log(res)
        editedRecord = res.problem
        expect(res.problem.title).toBe(randomString)
        expect(res.problem.time_limit).toBe(2)
        expect(res.problem.memory_limit).toBe(256)
        expect(res.problem.description).toBe('456')
        expect(res.problem.input).toBe('456')
        expect(res.problem.output).toBe('456')
        expect(res.problem.sample_input).toBe('456')
        expect(res.problem.sample_output).toBe('456')
        expect(res.problem.hint).toBe('456')
        expect(res.problem.spj).toBe(0)
        expect(res.problem.level).toBe(0)
        expect(res.problem.tags[0].name).toBe(randomTagString)
        done()
      })
      .catch(err => {
        done(err)
      })
  })
  it('getProblemList', async done => {
    problemApi
      .getProblemList({
        page: 1,
        perpage: 10,
      })
      .then(res => {
        expect(res.data[0].id).toBe(newRecord.id)
        expect(res.data[0].tags.length).toBe(1)
        done()
      })
      .catch(err => {
        done(err)
      })
  })
  it('toggleProblemStatus', async done => {
    await problemApi.toggleProblemStatus(newRecord.id)()
    problemApi
      .getProblem(newRecord.id)()
      .then(res => {
        console.log(res)
        expect(res.problem.defunct).toBe(1)
        done()
      })
      .catch(err => {
        done(err)
      })
  })
  it('addProblemData', async done => {
    const randomString = generateRandomString(10)
    const randomContent = generateRandomString(10)
    await problemApi
      .addProblemData(newRecord.id)({
        filename: randomString,
      })
      .catch(err => {
        done(err)
      })
    await problemApi
      .editProblemData(
        newRecord.id,
        `${randomString}.in`
      )({
        content: randomContent,
      })
      .catch(err => {
        done(err)
      })
    await problemApi
      .getProblemDataFile(newRecord.id, `${randomString}.in`)()
      .then(res => {
        expect(res.content).toBe(randomContent)
      })
      .catch(err => {
        done(err)
      })
    await problemApi
      .deleteProblemData(newRecord.id, `${randomString}.in`)()
      .catch(err => {
        done(err)
      })
    await problemApi
      .deleteProblemData(newRecord.id, `${randomString}.out`)()
      .catch(err => {
        done(err)
      })
    done()
  })
  it('deleteProblem', async done => {
    await problemApi.deleteProblem(newRecord.id)()
    newRecord.tags.forEach(async tag => {
      await tagApi
        .deleteTag(tag.id)()
        .then(res => {
          console.log(res)
        })
        .catch(err => {
          done(err)
        })
    })
    editedRecord.tags.forEach(async tag => {
      await tagApi
        .deleteTag(tag.id)()
        .then(res => {
          console.log(res)
        })
        .catch(err => {
          done(err)
        })
    })
    await problemApi
      .getProblem(newRecord.id)()
      .then(res => {
        done(res)
      })
      .catch(err => {
        done()
      })
  })
})
