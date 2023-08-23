const { expect } = require('chai')
const sinon = require('sinon')
const Testr = require('../lib/testr-node')
const log = console.log.bind(console)

describe('Testr Class', () => {
  let consoleLog, consoleError

  beforeEach(() => {
    consoleLog = sinon.stub(console, 'log')
    consoleError = sinon.stub(console, 'error')
  })

  afterEach(() => {
    consoleLog.restore()
    consoleError.restore()
  })

  describe('Test Lifecycle', () => {
    it('should execute beforeAll, beforeEach, afterEach, and afterAll hooks', async () => {
      const testr = new Testr()
      const beforeAllSpy = sinon.spy()
      const beforeEachSpy = sinon.spy()
      const afterEachSpy = sinon.spy()
      const afterAllSpy = sinon.spy()

      testr.before.all(beforeAllSpy)
      testr.before.each(beforeEachSpy)
      testr.after.each(afterEachSpy)
      testr.after.all(afterAllSpy)

      testr.describe('suite test', () => {
        testr.it('should work', sinon.fake())
      })

      await testr.run()

      expect(beforeAllSpy.calledOnce).to.be.true
      expect(beforeEachSpy.calledOnce).to.be.true
      expect(afterEachSpy.calledOnce).to.be.true
      expect(afterAllSpy.calledOnce).to.be.true
    })

    it('should omit a test if status is "omit"', async () => {
      const testr = new Testr()
      const testFnSpy = sinon.spy()

      testr.describe.omit('suite test', () => {
        testr.it('should not be called', testFnSpy)
      })

      await testr.run()

      expect(testFnSpy.notCalled).to.be.true
    })
  })

  describe('Logging', () => {
    it('should log a success message', async () => {
      const testr = new Testr()
      const test = { description: 'sample test' }
      testr._success(test, '')
      expect(consoleLog.calledWith(`\x1b[32m%s\x1b[0m`, '✔ ', test.description)).to.be.true
    })

    it('should log an error message', async () => {
      const testr = new Testr()
      const test = { description: 'sample test' }
      testr._error(new Error('fail'), test, '')
      expect(consoleError.calledWith(`\x1b[31m%s\x1b[0m`, '✘ ', test.description)).to.be.true
    })
  })

  describe('Suite Handling', () => {
    it('should create a new suite with _createSuite', () => {
      const testr = new Testr()
      const suite = testr._createSuite('Test Suite', 'normal')

      expect(suite).to.deep.equal({
        description: 'Test Suite',
        status: 'normal',
        tests: [],
        suites: [],
        beforeAll: null,
        beforeEach: null,
        afterAll: null,
        afterEach: null,
      })
    })

    it('should push the new suite to the current suite with _describe', () => {
      const testr = new Testr()
      const description = 'New Suite'
      testr._describe('normal', description, () => {})

      expect(testr._currentSuite.suites[0].description).to.equal(description)
    })

    it('should add a test to the current suite with _it', () => {
      const testr = new Testr()
      const description = 'should do something'
      const testFn = () => {}

      testr._it('normal', description, testFn)

      expect(testr._currentSuite.tests[0]).to.deep.equal({ description, testFn, status: 'normal' })
    })
  })
  
  describe('Describe and It Handling', () => {
    it('should create a normal suite with describe', () => {
      const testr = new Testr()
      const description = 'Normal Suite'
      testr.describe(description, () => {})

      expect(testr._currentSuite.suites[0].description).to.equal(description)
      expect(testr._currentSuite.suites[0].status).to.equal('normal')
    })

    it('should create an only suite with describe.only', () => {
      const testr = new Testr()
      const description = 'Only Suite'
      testr.describe.only(description, () => {})

      expect(testr._currentSuite.suites[0].description).to.equal(description)
      expect(testr._currentSuite.suites[0].status).to.equal('only')
    })

    it('should create an omitted suite with describe.omit', () => {
      const testr = new Testr()
      const description = 'Omitted Suite'
      testr.describe.omit(description, () => {})

      expect(testr._currentSuite.suites[0].description).to.equal(description)
      expect(testr._currentSuite.suites[0].status).to.equal('omit')
    })

    it('should create a normal test with it', () => {
      const testr = new Testr()
      const description = 'Normal Test'
      testr._it('normal', description, () => {})

      expect(testr._currentSuite.tests[0].description).to.equal(description)
      expect(testr._currentSuite.tests[0].status).to.equal('normal')
    })

    it('should create an only test with it.only', () => {
      const testr = new Testr()
      const description = 'Only Test'
      testr._it('only', description, () => {})

      expect(testr._currentSuite.tests[0].description).to.equal(description)
      expect(testr._currentSuite.tests[0].status).to.equal('only')
    })

    it('should create an omitted test with it.omit', () => {
      const testr = new Testr()
      const description = 'Omitted Test'
      testr._it('omit', description, () => {})

      expect(testr._currentSuite.tests[0].description).to.equal(description)
      expect(testr._currentSuite.tests[0].status).to.equal('omit')
    })
  })

  describe('Running Tests', () => {
    it('should run only suites if onlySuites has suites', async () => {
      const testr = new Testr()
      const normalSuite = testr._createSuite('Normal Suite', 'normal')
      const onlySuite = testr._createSuite('Only Suite', 'only')

      testr.suites.push(normalSuite)
      testr.onlySuites.push(onlySuite)

      const runSuitesSpy = sinon.spy(testr, '_runSuites')

      await testr._run()

      expect(runSuitesSpy.calledWith(testr.onlySuites)).to.be.true
    })

    it('should run normal suites if onlySuites is empty', async () => {
      const testr = new Testr()
      const normalSuite = testr._createSuite('Normal Suite', 'normal')
      testr.suites.push(normalSuite)

      const runSuitesSpy = sinon.spy(testr, '_runSuites')

      await testr._run()

      expect(runSuitesSpy.calledWith(testr.suites)).to.be.true
    })
  })

  describe('Static Methods', () => {
    it('should bind instance methods to an object with bind', () => {
      const instance = Testr.bind()

      expect(instance.describe).to.be.a('function')
      expect(instance.it).to.be.a('function')
      expect(instance.before).to.be.a('function')
      expect(instance.after).to.be.a('function')
      expect(instance.run).to.be.a('function')
    })

    it('should explode instance methods to global with explode', () => {
      Testr.explode()

      expect(global.describe).to.be.a('function')
      expect(global.it).to.be.a('function')
      expect(global.before).to.be.a('function')
      expect(global.after).to.be.a('function')
      expect(global.run).to.be.a('function')
    })
  })
})
