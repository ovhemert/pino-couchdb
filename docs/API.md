# API

The library exposes a function to write directly to CouchDB from your own application. The example below shows how this can be done using [pino-multi-stream](https://github.com/pinojs/pino-multi-stream).

Example:

```js
const couchdb = require('pino-couchdb')
const pinoms = require('pino-multi-stream')
// create the couchdb destination stream
const writeStream = await couchdb.createWriteStream()
// create pino loggger
const logger = pinoms({ streams: [writeStream] })
// log some events
logger.info('Informational message')
logger.error(new Error('things got bad'), 'error message')
```

## Functions

### createWriteStream

The `createWriteStream` function creates a writestream that `pino-multi-stream` can use to send logs to.

Example:

```js
const writeStream = await couchdb.createWriteStream({
  url: 'http://127.0.0.1:5984',
  db: 'logs',
  size: 10
})
````

#### url

Type: `String` *(optional)*

The URL of the host that runs CouchDB. Defaults to `http://127.0.0.1:5984` for an instance running on the local machine.

#### db

Type: `String` *(optional)*

The name of the database to use and tries to create it when it does not exist. Defaults to `logs`.
