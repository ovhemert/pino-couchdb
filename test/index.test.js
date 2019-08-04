'use strict'

const test = require('tap').test
const tested = require('../src/index')
const sinon = require('sinon')

const couchdb = require('../src/couchdb')

test('creates write stream', t => {
  const stubValidate = sinon.stub(couchdb.Client.prototype, 'validate').resolves()
  tested.createWriteStream().then(writeStream => {
    t.ok(writeStream.writable)
    stubValidate.restore()
    t.end()
  }).catch(err => {
    t.fail(err.message)
    stubValidate.restore()
    t.end()
  })
})
