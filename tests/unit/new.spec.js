import * as newApi from '../../src/admin/api/newts'

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

describe('news crud', () => {
  let newObject
  it('createNew', async done => {
    const randomTitle = generateRandomString(10)
    newApi
      .createNew({
        title: randomTitle,
        content: 'content',
      })
      .then(res => {
        console.log(res)
        newObject = res.new
        expect(res.new.title).toBe(randomTitle)
        expect(res.new.content).toBe('content')
        done()
      })
      .catch(err => {
        done(err)
      })
  })
  it('editNew', async done => {
    const randomTitle = generateRandomString(10)
    newApi
      .editNew(newObject.id)({
        title: randomTitle,
        content: 'content',
      })
      .then(res => {
        console.log(res)
        expect(res.new.title).toBe(randomTitle)
        expect(res.new.content).toBe('content')
        done()
      })
      .catch(err => {
        done(err)
      })
  })
  it('toggleStatus', async done => {
    await newApi.toggleNewStatus(newObject.id)()
    newApi
      .getNew(newObject.id)()
      .then(res => {
        expect(res.new.defunct).toBe(1)
        done()
      })
      .catch(err => {
        done(err)
      })
  })
  it('toggleNewTopStatus', async done => {
    await newApi.toggleNewTopStatus(newObject.id)()
    newApi
      .getNew(newObject.id)()
      .then(res => {
        expect(res.new.top).toBeGreaterThan(0)
        done()
      })
      .catch(err => {
        done(err)
      })
  })
  it('deleteNew', async done => {
    await newApi.deleteNew(newObject.id)()
    newApi
      .getNew(newObject.id)()
      .then(res => {
        done(res)
      })
      .catch(err => {
        done()
      })
  })
})
