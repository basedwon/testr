#!/usr/bin/env node
const path = require('path')
const TestrNode = require('./testr-node')

let testPath = process.argv[2]
if (!testPath || !testPath.startsWith('/'))
  testPath = testPath ? path.resolve(process.cwd(), testPath) : process.cwd()

const testr = TestrNode.explode(testPath)
testr.run()
  .then(() => console.log(`\x1b[32m%s\x1b[0m`, '\n✔ ', `tests complete\n`))
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
