#!/usr/bin/env node
const path = require('path')
const log = console.log.bind(console)
const TestrNode = require('./testr-node')

let testPath = process.argv[2]
if (!testPath || !testPath.startsWith('/'))
  testPath = testPath ? path.resolve(process.cwd(), testPath) : process.cwd()

const run = TestrNode.explode(testPath)
run()
  .then(() => log('\n✔ tests complete\n'))
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
