'use strict'

const axios = require('axios')
const stream = require('stream')

class Client {
  constructor (options = {}) {
    this._url = options.url || 'http://127.0.0.1:5984'
    this._db = options.db || 'logs'
  }

  async insert (items = []) {
    const docs = Array.isArray(items) ? items : [items]
    if (docs.length <= 0) { return }
    const data = { docs }
    try {
      const url = `${this._url}/${this._db}/_bulk_docs`
      const result = await axios.post(url, data)
      return result
    } catch (err) {
      throw Error(err.message)
    }
  }

  insertStream () {
    const self = this
    const writeStream = new stream.Writable({ objectMode: true, highWaterMark: 1 })
    writeStream._write = function (chunk, encoding, callback) {
      self.insert(chunk).then(() => { callback(null) }).catch(callback)
    }
    return writeStream
  }

  async validate () {
    try {
      const server = (await axios.get(this._url)).data
      if (!server || !server.couchdb || !server.version) { throw Error('No couch found') }
      const url = `${this._url}/${this._db}`
      return axios.get(url).catch(err => {
        if (err.response.status !== 404) { throw Error(err.message) }
        return axios.put(url)
      })
    } catch (err) {
      throw Error(err.message)
    }
  }
}

module.exports = { Client }
