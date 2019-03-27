'use strict'

const couchdb = require('../src/couchdb')

async function main () {
  const client = new couchdb.Client()

  await client.validate()
  // await client.insert({ name: 'item 1' })

  let ws = client.insertStream()
  ws.write({ id: 1 })
  ws.end()
}

main()
