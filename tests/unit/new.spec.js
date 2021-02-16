import { generateRandomString } from './common'
import * as newApi from '../../src/admin/api/newts'

describe('news crud', () => {
  let newRecord
  it('createNew', async done => {
    const randomString = generateRandomString(10)
    await newApi
      .createNew({
        title: randomString,
        content: 'content',
      })
      .then(res => {
        newRecord = res.new
      })
      .catch(err => {
        done(err)
      })
    newApi
      .getNew(newRecord.id)()
      .then(res => {
        expect(res.new.title).toBe(randomString)
        expect(res.new.content).toBe('content')
        done()
      })
      .catch(err => {
        done(err)
      })
  })
  it('editNew', async done => {
    const randomString = generateRandomString(10)
    await newApi.editNew(newRecord.id)({
      title: randomString,
      content: 'content',
    })
    newApi
      .getNew(newRecord.id)()
      .then(res => {
        newRecord = res.new
        expect(res.new.title).toBe(randomString)
        expect(res.new.content).toBe('content')
        done()
      })
      .catch(err => {
        done(err)
      })
  })
  it('toggleStatus', async done => {
    await newApi.toggleNewStatus(newRecord.id)()
    newApi
      .getNew(newRecord.id)()
      .then(res => {
        expect(res.new.defunct).toBe(1)
        done()
      })
      .catch(err => {
        done(err)
      })
  })
  it('toggleNewTopStatus', async done => {
    await newApi.toggleNewTopStatus(newRecord.id)()
    newApi
      .getNew(newRecord.id)()
      .then(res => {
        expect(res.new.top).toBeGreaterThan(0)
        done()
      })
      .catch(err => {
        done(err)
      })
  })
  it('getNewList', async done => {
    newApi
      .getNewList({
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
  it('deleteNew', async done => {
    await newApi.deleteNew(newRecord.id)()
    newApi
      .getNew(newRecord.id)()
      .then(res => {
        done(res)
      })
      .catch(err => {
        done()
      })
  })
})
