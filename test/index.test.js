'use strict'

const test = require('tap').test
const tested = require('../src/index')
const sinon = require('sinon')

const couchdb = require('../src/couchdb')

test('creates write stream', t => {
  let stubValidate = sinon.stub(couchdb.Client.prototype, 'validate').resolves()
  tested.createWriteStream().then(writeStream => {
    t.ok(writeStream.writable)
  }).catch(err => {
    t.fail(err.message)
  }).finally(() => {
    stubValidate.restore()
    t.end()
  })
})
