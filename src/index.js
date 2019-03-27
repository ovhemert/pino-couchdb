'use strict'

const couchdb = require('./couchdb')
const streams = require('./streams')
const pumpify = require('pumpify')

async function createWriteStream (options = {}) {
  const { size = 1 } = options

  const parseJsonStream = streams.parseJsonStream()
  const batchStream = streams.batchStream(size)

  const client = new couchdb.Client(options)
  await client.validate()
  const writeStream = client.insertStream()

  return pumpify(parseJsonStream, batchStream, writeStream)
}

module.exports.createWriteStream = createWriteStream
