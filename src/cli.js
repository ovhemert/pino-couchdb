#!/usr/bin/env node

const program = require('commander')

const pkg = require('../package.json')
const pinoCouchDb = require('././index')

// main cli logic
function main () {
  program
    .version(pkg.version)
    .option('-u, --url <url>', 'The url of the CouchDB host (defaults to "http://127.0.0.1:5984")')
    .option('-d, --database <db>', 'The name of the database to use (defaults to "logs")')
    .option('-b, --batch <size>', 'Number of logs to group in a batch for a single write (defaults to "1")')
    .action(async ({ url, db, size }) => {
      try {
        const writeStream = await pinoCouchDb.createWriteStream({ url, db, size })
        process.stdin.pipe(writeStream)
        console.info('logging')
      } catch (error) {
        console.log(error.message)
      }
    })

  program.parse(process.argv)
}

main()
