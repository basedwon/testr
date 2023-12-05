# Testr

> gitr done, testr first

[![npm](https://img.shields.io/npm/v/@basd/testr?style=flat&logo=npm)](https://www.npmjs.com/package/@basd/testr)
[![pipeline](https://gitlab.com/basedwon/testr/badges/master/pipeline.svg)](https://gitlab.com/basedwon/testr/-/pipelines)
[![license](https://img.shields.io/npm/l/@basd/testr)](https://gitlab.com/basedwon/testr/-/blob/master/LICENSE)
[![downloads](https://img.shields.io/npm/dw/@basd/testr)](https://www.npmjs.com/package/@basd/testr) 

[![Gitlab](https://img.shields.io/badge/Gitlab%20-%20?logo=gitlab&color=%23383a40)](https://gitlab.com/basedwon/testr)
[![Github](https://img.shields.io/badge/Github%20-%20?logo=github&color=%23383a40)](https://github.com/basedwon/testr)
[![Twitter](https://img.shields.io/badge/@basdwon%20-%20?logo=twitter&color=%23383a40)](https://twitter.com/basdwon)
[![Discord](https://img.shields.io/badge/Basedwon%20-%20?logo=discord&color=%23383a40)](https://discordapp.com/users/basedwon)

Testr is a flexible, lightweight and based testing library for JS. It's designed to work seamlessly in both browser and Node.js environments. It supports a variety of features such as nesting, asynchronous execution, and exclusion/inclusion of test cases to streamline your testing workflow.

## Installation

To install Testr, use npm:

```sh
npm i -D @basd/testr
```

## Usage

### Basic Usage

Here is a simple example of using Testr:

```js
const Testr = require('@basd/testr')

const testr = new Testr()

testr.describe('A test suite', () => {
  testr.it('A test case', () => {
    if (1 + 1 !== 2) {
      throw new Error('Math is broken!')
    }
    expect(2 + 2).to.equal(4)
  })
})

testr.run()
```
Or you can instantiate and destructure the functions you need:

```js
const { describe, it, before, after, expect, assert, run, testr } = new Testr()
// or as a function
const { describe, it, before, after, expect, assert, run, testr } = Testr()
// which means you can do this:
const { describe, it, before, after, expect, assert, run, testr } = require('@basd/testr')()
```

In this example, we create a test suite with `describe()`, add a test case with `it()`, and run our tests with `run()`.

### Skipping and Only Running Certain Tests

You can also mark test cases or suites to be skipped with `describe.omit()` and `it.omit()`, or to be the only ones run with `describe.only()` and `it.only()`.

```js
describe.omit('A skipped test suite', () => {
  it('A skipped test case', () => {})
})

describe.only('A test suite to run alone', () => {
  it.only('A test case to run alone', () => {})
})
```

### Before and After Hooks

You can use `before.each()`, `after.each()`, `before.all()`, and `after.all()` to set up and tear down for tests:

```js
describe('A test suite', () => {
  let counter = 0
  
  before.each(() => {
    counter = 1
  })
  
  it('A test case', () => {
    if (counter !== 1) {
      throw new Error('Counter not initialized!')
    }
  })
  
  after.each(() => {
    counter = 0
  })
})
```

### Node.js Environment

For Node.js environments, `TestrNode` provides additional functionality:

```js
const TestrNode = require('@basd/testr')

TestrNode.explode('path/to/tests', ['path/to/tests/to/ignore'])
```

In this example, `TestrNode` will automatically find and require test files in the specified directory that end with `.test.js`, and ignore the ones in the directories to ignore.

### CLI Usage

If you have installed Testr globally or in your project, you can use the `testr` command to run your tests from the command line:

```sh
# Run all test files in a directory
testr path/to/tests

# Run all test files, except those in certain directories (coming soon..)
testr path/to/tests --ignore path/to/tests/to/ignore
```

This will automatically find and run any files ending with `.test.js`.

## Contributing

Contributions are welcome! Please open an issue if you encounter any problems, or a pull request if you make a change.

## Donations

If you find this project useful and want to help support further development, please send us some coin. We greatly appreciate any and all contributions. Thank you!

**Bitcoin (BTC):**
```
1JUb1yNFH6wjGekRUW6Dfgyg4J4h6wKKdF
```

**Monero (XMR):**
```
46uV2fMZT3EWkBrGUgszJCcbqFqEvqrB4bZBJwsbx7yA8e2WBakXzJSUK8aqT4GoqERzbg4oKT2SiPeCgjzVH6VpSQ5y7KQ
```

## License

@basd/testr is [MIT licensed](https://gitlab.com/basedwon/testr/-/blob/master/LICENSE).
