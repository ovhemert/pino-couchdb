'use strict'

const test = require('tap').test
const tested = require('../src/couchdb')
const sinon = require('sinon')

let axios = require('axios')

test('creates client', t => {
  const client = new tested.Client()
  t.equals(client._url, 'http://127.0.0.1:5984')
  t.equals(client._db, 'logs')
  t.end()
})

test('validates server not available', async t => {
  const client = new tested.Client()
  let stubGet = sinon.stub(axios, 'get').rejects()
  const validate = client.validate()
  try {
    await t.rejects(validate)
  } finally {
    stubGet.restore()
    t.end()
  }
})

test('validates server is couch', async t => {
  const client = new tested.Client()
  let stubGet = sinon.stub(axios, 'get').resolves({ name: 'ChairDB server!' })
  const validate = client.validate()
  try {
    await t.rejects(validate)
  } finally {
    stubGet.restore()
    t.end()
  }
})

test('validates database create', async t => {
  const client = new tested.Client()
  let stubGet = sinon.stub(axios, 'get').callsFake(async function (url) {
    if (url.endsWith('/logs')) {
      let err = Error('Does not exist'); err.response = { status: 404 }
      return Promise.reject(err)
    }
    return Promise.resolve({ data: { couchdb: 'Welcome', version: '2.0.0' } })
  })
  let stubPut = sinon.stub(axios, 'put').resolves()
  const validate = client.validate()
  try {
    await t.resolves(validate)
  } finally {
    stubGet.restore()
    stubPut.restore()
    t.end()
  }
})

test('validates database create error', async t => {
  const client = new tested.Client()
  let stubGet = sinon.stub(axios, 'get').callsFake(async function (url) {
    if (url.endsWith('/logs')) {
      let err = Error('Does not exist'); err.response = { status: 404 }
      return Promise.reject(err)
    }
    return Promise.resolve({ data: { couchdb: 'Welcome', version: '2.0.0' } })
  })
  let stubPut = sinon.stub(axios, 'put').rejects()
  const validate = client.validate()
  try {
    await t.rejects(validate)
  } finally {
    stubGet.restore()
    stubPut.restore()
    t.end()
  }
})

test('validates server and db available', async t => {
  const client = new tested.Client()
  let stubGet = sinon.stub(axios, 'get').callsFake(async function (url) {
    const response = (url.endsWith('/logs')) ? {} : { data: { couchdb: 'Welcome', version: '2.0.0' } }
    return Promise.resolve(response)
  })
  const validate = client.validate()
  try {
    await t.resolves(validate)
  } finally {
    stubGet.restore()
    t.end()
  }
})

test('validates db get error', async t => {
  const client = new tested.Client()
  let stubGet = sinon.stub(axios, 'get').callsFake(async function (url) {
    if (url.endsWith('/logs')) {
      let err = Error('Crazy error'); err.response = { status: 400 }
      return Promise.reject(err)
    }
    return Promise.resolve({ data: { couchdb: 'Welcome', version: '2.0.0' } })
  })
  const validate = client.validate()
  try {
    await t.rejects(validate)
  } finally {
    stubGet.restore()
    t.end()
  }
})

test('calls insert without document', t => {
  let client = new tested.Client()
  client.insert().then(data => {
    t.equals(data, undefined)
    t.end()
  })
})

test('errors on failed insert', async t => {
  let client = new tested.Client()
  let stubPost = sinon.stub(axios, 'post').rejects()
  const insert = client.insert({ id: 'crazy invalid document' })
  try {
    await t.rejects(insert)
  } finally {
    stubPost.restore()
    t.end()
  }
})

test('inserts single document', t => {
  let client = new tested.Client()
  let stubPost = sinon.stub(axios, 'post').resolvesArg(1)
  client.insert({ id: 1 }).then(data => {
    t.equals(data.docs.length, 1)
    t.equals(data.docs[0].id, 1)
    stubPost.restore()
    t.end()
  })
})

test('inserts multiple documents', t => {
  let client = new tested.Client()
  let stubPost = sinon.stub(axios, 'post').resolvesArg(1)
  client.insert([{ id: 1 }, { id: 2 }, { id: 3 }]).then(data => {
    t.equals(data.docs.length, 3)
    t.equals(data.docs[0].id, 1)
    t.equals(data.docs[1].id, 2)
    t.equals(data.docs[2].id, 3)
    stubPost.restore()
    t.end()
  })
})

test('inserts with write stream', t => {
  let client = new tested.Client()
  let stubPost = sinon.stub(axios, 'post')
  let ws = client.insertStream()
  ws.write({ id: 1 })
  ws.end()
  t.ok(stubPost.called)
  t.end()
})
