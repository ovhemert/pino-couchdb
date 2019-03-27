# CLI

To use `pino-couchdb` from the command line, you need to install it globally:

```bash
$ npm install -g pino-couchdb
```

## Example

Given an application `foo` that logs via pino, a couchdb log database `bar` on the local machine, you would use `pino-couchdb` like so:

```bash
$ node foo | pino-couchdb --database bar
```

## Usage

You can pass the following options via cli arguments:

| Short command | Full command | Description |
| ------------- | ------------ |-------------|
| -V | --version | Output the version number |
| -u | --url &lt;url&gt; | The url of the CouchDB host (defaults to "http://127.0.0.1:5984") |
| -d | --database &lt;db&gt; | The name of the database to use (defaults to "logs") |
| -b | --batch &lt;size&gt; | Number of logs to group in a batch for a single write (defaults to "1") |
| -h | --help | Output usage information |

See the [API](./API.md) documentation for details.
