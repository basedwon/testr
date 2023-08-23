require('../lib/testr-node')()
const log = console.log.bind(console)

async function test() {
  describe('Main', () => {
    it('should work', () => {
      expect(2 + 2).to.equal(4)
    })
  })
  await run()
}

test()

/* // @todo
const Testr = require('../lib/testr-node')
const testr = new Testr()

testr.describe('Testr functionality', () => {
  testr.it('it honors "only" at root level', () => {
    const instanceUnderTest = new Testr()
    instanceUnderTest.describe.only('Only Test Suite', () => {
      instanceUnderTest.it('Test 1', () => {})
    })
    instanceUnderTest.describe('Ignored Test Suite', () => {
      instanceUnderTest.it('Test 2', () => {})
    })
    // instanceUnderTest.run()
    // if (instanceUnderTest.suitesToRun.length !== 1 || instanceUnderTest.suitesToRun[0].description !== 'Only Test Suite') {
    //   throw new Error('Only suite not correctly identified')
    // }
  })
  testr.it('it honors "omit"', () => {
    // const instanceUnderTest = new Testr()
    // instanceUnderTest.describe('Test Suite', () => {
    //   instanceUnderTest.it('Test 1', () => {})
    //   instanceUnderTest.itOmit('Test 2', () => {})
    // })
    // instanceUnderTest.run()
    // if (instanceUnderTest.currentSuite.tests.some(test => test.status === 'omit')) {
    //   throw new Error('Omit suite not correctly identified')
    // }
  })
  testr.it('it honors nested "only"', () => {
    // const instanceUnderTest = new Testr()
    // instanceUnderTest.describe('Root Suite', () => {
    //   instanceUnderTest.describe.only('Nested Only Suite', () => {
    //     instanceUnderTest.it('Test 1', () => {})
    //   })
    //   instanceUnderTest.describe('Nested Ignored Suite', () => {
    //     instanceUnderTest.it('Test 2', () => {})
    //   })
    // })
    // instanceUnderTest.run()
    // if (instanceUnderTest.suitesToRun.length !== 1 || instanceUnderTest.suitesToRun[0].suites[0].description !== 'Nested Only Suite') {
    //   throw new Error('Nested only suite not correctly identified')
    // }
  })
})

// testr.run()
*/
