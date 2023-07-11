
# Testr

Testr is a flexible and lightweight testing library for JavaScript. It's designed to work seamlessly in both browser and Node.js environments. It supports a variety of features such as nesting, asynchronous execution, and exclusion/inclusion of test cases to streamline your testing workflow.

## Installation

To install Testr, use npm:

```sh
npm install @basd/testr
```

## Usage

### Basic Usage

Here is a simple example of using Testr:

```js
const { Testr } = require('@basd/testr')

const testr = new Testr()

testr.describe('A test suite', () => {
  testr.it('A test case', () => {
    if (1 + 1 !== 2) {
      throw new Error('Math is broken!')
    }
  })
})

testr.run()
```

In this example, we create a test suite with `describe()`, add a test case with `it()`, and run our tests with `run()`.

### Skipping and Only Running Certain Tests

You can also mark test cases or suites to be skipped with `describeOmit()` and `itOmit()`, or to be the only ones run with `describeOnly()` and `itOnly()`.

```js
testr.describeOmit('A skipped test suite', () => {
  testr.it('A skipped test case', () => {})
})

testr.describeOnly('A test suite to run alone', () => {
  testr.itOnly('A test case to run alone', () => {})
})
```

### Before and After Hooks

You can use `beforeEach()`, `afterEach()`, `beforeAll()`, and `afterAll()` to set up and tear down for tests:

```js
testr.describe('A test suite', () => {
  let counter = 0
  
  testr.beforeEach(() => {
    counter = 1
  })
  
  testr.it('A test case', () => {
    if (counter !== 1) {
      throw new Error('Counter not initialized!')
    }
  })
  
  testr.afterEach(() => {
    counter = 0
  })
})
```

### Node.js Environment

For Node.js environments, `TestrNode` provides additional functionality:

```js
const { TestrNode } = require('@basd/testr')

TestrNode.explode('path/to/tests', ['path/to/tests/to/ignore'])
```

In this example, `TestrNode` will automatically find and require test files in the specified directory that end with `.test.js`, and ignore the ones in the directories to ignore.

### CLI Usage

If you have installed Testr globally or in your project, you can use the `testr` command to run your tests from the command line:

```sh
# Run all test files in a directory
testr path/to/tests

# Run all test files, except those in certain directories
testr path/to/tests --ignore path/to/tests/to/ignore
```

This will automatically find and run any files ending with `.test.js`.

## Contributing

Contributions are welcome! Please open an issue if you encounter any problems, or a pull request if you make a change.
