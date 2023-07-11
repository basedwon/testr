const _ = require('lodash')
const log = console.log.bind(console)
const { assert, expect } = require('chai')

class Testr {
  constructor() {
    this.suites = []
    this.currentSuite = null
    this.onlySuites = []
  }
  beforeEach(fn) {
    if (!this.currentSuite)
      throw new Error('beforeEach must be called within a describe block')
    this.currentSuite.beforeEach = fn
  }
  afterEach(fn) {
    if (!this.currentSuite)
      throw new Error('afterEach must be called within a describe block')
    this.currentSuite.afterEach = fn
  }
  beforeAll(fn) {
    if (!this.currentSuite)
      throw new Error('beforeAll must be called within a describe block')
    this.currentSuite.beforeAll = fn
  }
  afterAll(fn) {
    if (!this.currentSuite)
      throw new Error('afterAll must be called within a describe block')
    this.currentSuite.afterAll = fn
  }
  success(test, indent) {
    log(`${indent}  %c✔ `, 'color: green', test?.description)
  }
  error(error, test, indent) {
    console.error(`${indent}  %c✘ `, 'color: red', test?.description)
  }
  describe(description, callback, status = 'normal') {
    const suite = {
      description,
      status,
      tests: [],
      suites: [],
      beforeAll: null,
      beforeEach: null,
      afterAll: null,
      afterEach: null,
    }
    if (this.currentSuite) {
      this.currentSuite.suites.push(suite)
    } else {
      this.suites.push(suite)
    }
    const prevSuite = this.currentSuite
    this.currentSuite = suite
    if (status === 'only') {
      this.onlySuites.push(suite)
    }
    callback()
    this.currentSuite = prevSuite
  }
  describeOnly(description, callback) {
    this.describe(description, callback, 'only')
  }
  describeOmit(description, callback) {
    this.describe(description, callback, 'omit')
  }
  it(description, testFn, status = 'normal') {
    const test = { description, testFn, status }
    if (this.currentSuite) {
      this.currentSuite.tests.push(test)
    }
  }
  itOnly(description, testFn) {
    this.it(description, testFn, 'only')
  }
  itOmit(description, testFn) {
    this.it(description, testFn, 'omit')
  }
  async run() {
    try {
      if (this.onlySuites.length > 0)
        await this.runSuites(this.onlySuites)
      else
        await this.runSuites(this.suites)
    } catch (error) {
      throw error
    }
  }
  async runSuites(suites) {
    try {
      for (let ii = 0; ii < suites.length; ii++) {
        await this.runSuite(suites[ii])
        if (ii !== suites.length - 1) log('')
      }
    } catch (error) {
      throw error
    }
  }
  async runSuite(suite, indent = '') {
    try {
      if (suite.status === 'omit') return
      log(`${indent}${suite.description}`)
      if (suite.tests.length > 0)
        await this.runTests(suite.tests, indent + '  ', suite)
      if (suite.suites.length > 0)
        for (const subSuite of suite.suites)
          await this.runSuite(subSuite, indent + '  ')
    } catch (error) {
      throw error
    }
  }
  async runTests(tests, indent = '', suite) {
    try {
      if (suite.beforeAll) await suite.beforeAll()
      for (const test of tests) {
        if (test.status === 'omit') continue
        if (suite.beforeEach) await suite.beforeEach()
        try {
          await test.testFn()
          this.success(test, indent)
        } catch (error) {
          this.error(error, test, indent)
          throw error
        }
        if (suite.afterEach) await suite.afterEach()
      }
      if (suite.afterAll) await suite.afterAll()
    } catch (error) {
      throw error
    }
  }
  static explode(...args) {
    const functions = [
      'beforeEach',
      'afterEach',
      'beforeAll',
      'afterAll',
      'describe',
      'describeOnly',
      'describeOmit',
      'it',
      'itOnly',
      'itOmit',
      'run',
    ]
    const testr = new this(...args)
    const obj = { _, log, assert, expect, testr }
    for (const key of functions)
      obj[key] = testr[key].bind(testr)
    _.assign(global, obj)
    return testr
  }
}

module.exports = new Proxy(Testr, {
  apply (target, __, args) {
    return target.explode(...args)
  }
})
