const { assert, expect } = require('chai')
const sinon = require('sinon')
const log = console.log.bind(console)

const getMethods = (obj) => {
  const orig = obj
  let keys = []
  do {
    keys = keys.concat(Object.getOwnPropertyNames(obj))
      .filter(k => !k.startsWith('_') && k !== 'constructor')
      .filter(k => typeof orig[k] === 'function' 
        || (typeof orig[k] === 'object' && orig[k].constructor))
    obj = Object.getPrototypeOf(obj)
  } while (obj && obj.constructor && obj.constructor.name !== 'Object')
  return Array.from(new Set(keys))
}

class Testr {
  constructor(...args) {
    this.args = args
    this.suites = []
    this.onlySuites = []
    this._currentSuite = this._createSuite('', null, 'root')
    this.suites.push(this._currentSuite)
  }
  get testr() {
    return this
  }
  get log() {
    return log
  }
  get assert() {
    return assert
  }
  get expect() {
    return expect
  }
  get sinon() {
    return sinon
  }
  get before() {
    const fn = f => this._currentSuite.beforeEach.push(f)
    fn.each = fn
    fn.all = f => this._currentSuite.beforeAll = f
    return fn
  }
  get after() {
    const fn = f => this._currentSuite.afterEach.push(f)
    fn.each = fn
    fn.all = f => this._currentSuite.afterAll = f
    return fn
  }
  get beforeEach() {
    return this.before
  }
  get afterEach() {
    return this.after
  }
  get beforeAll() {
    return this.before.all
  }
  get afterAll() {
    return this.after.all
  }
  _createSuite(description, parentSuite = null, status = 'normal') {
    const suite = {
      description,
      status,
      tests: [],
      suites: [],
      beforeAll: null,
      beforeEach: parentSuite ? [...parentSuite.beforeEach] : [],
      afterAll: null,
      afterEach: parentSuite ? [...parentSuite.afterEach] : [],
    }
    return suite
  }
  _describe(status, description, callback) {
    const suite = this._createSuite(description, this._currentSuite, status)
    if (this._currentSuite) {
      this._currentSuite.suites.push(suite)
    } else {
      this.suites.push(suite)
    }
    const prevSuite = this._currentSuite
    this._currentSuite = suite
    if (status === 'only') {
      this.onlySuites.push(suite)
    }
    callback()
    this._currentSuite = prevSuite
  }
  get describe() {
    const fn = this._describe.bind(this, 'normal')
    fn.only = this._describe.bind(this, 'only')
    fn.omit = this._describe.bind(this, 'omit')
    return fn
  }
  _it(status, description, testFn) {
    const test = { description, testFn, status }
    this._currentSuite.tests.push(test)
  }
  get it() {
    const fn = this._it.bind(this, 'normal')
    fn.only = this._it.bind(this, 'only')
    fn.omit = this._it.bind(this, 'omit')
    return fn
  }
  _success(test, indent) {
    console.log(`${indent}  %c✔ `, 'color: green', test?.description)
  }
  _error(error, test, indent) {
    console.error(`${indent}  %c✘ `, 'color: red', test?.description)
  }
  get run() {
    return this._run.bind(this)
  }
  async _run() {
    console.log('')
    try {
      if (this.onlySuites.length > 0)
        await this._runSuites(this.onlySuites)
      else
        await this._runSuites(this.suites)
    } catch (error) {
      throw error
    }
    console.log('')
  }
  async _runSuites(suites) {
    try {
      for (let ii = 0; ii < suites.length; ii++) {
        await this._runSuite(suites[ii])
      }
    } catch (error) {
      throw error
    }
  }
  async _runSuite(suite, indent = '') {
    try {
      if (suite.status === 'omit') return
      if (suite.beforeAll) await suite.beforeAll()
      if (suite.status !== 'root')
        console.log(`${indent}${suite.description}`)
      await this._runTests(suite.tests, indent + '  ', suite)
      for (const subSuite of suite.suites)
        await this._runSuite(subSuite, indent + '  ')
      if (suite.afterAll) await suite.afterAll()
    } catch (error) {
      throw error
    }
  }
  async _runTests(tests, indent = '', suite) {
    try {
      const onlyTests = tests.filter(t => t.status === 'only')
      if (onlyTests.length) tests = onlyTests
      for (const test of tests) {
        if (test.status === 'omit') continue
        for (const fn of suite.beforeEach)
          await fn()
        try {
          await test.testFn()
          this._success(test, indent)
        } catch (error) {
          this._error(error, test, indent)
          throw error
        }
        for (const fn of suite.afterEach)
          await fn()
      }
    } catch (error) {
      throw error
    }
  }
  static bind(...args) {
    const instance = new this(...args)
    const names = getMethods(this.prototype)
    const obj = {}
    for (const name of names) {
      Object.defineProperty(obj, name, { value: instance[name], enumerable: true })
    }
    return obj
  }
  static explode(...args) {
    const obj = this.bind(...args)
    Object.assign(global, obj)
    return obj.testr
  }
  static proxy() {
    return new Proxy(this, {
      apply: (target, __, args) => target.explode(...args)
    })
  }
}

module.exports = Testr.proxy()
