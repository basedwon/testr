const fs = require('fs')
const path = require('path')
const Testr = require('./testr')
const log = console.log.bind(console)

const colors = {
  black: 30,
  red: 31,
  green: 32,
  yellow: 33,
  blue: 34,
  magenta: 35,
  cyan: 36,
  white: 37,
}

class TestrNode extends Testr {
  success(test, indent) {
    log(`${indent}\x1b[${colors.green}m%s\x1b[0m`, '✔ ', test.description)
  }
  error(error, test, indent) {
    console.error(`${indent}\x1b[${colors.red}m%s\x1b[0m`, '✘ ', test.description)
  }
  findTestFiles(dir, fileList = []) {
    if (!fs.existsSync(dir))
      throw new Error(`File path ${dir} does not exist`)
    if (!fs.statSync(dir).isDirectory())
      return [dir]
    const files = fs.readdirSync(dir)
    files.forEach((file) => {
      const filePath = path.join(dir, file)
      if (fs.statSync(filePath).isDirectory()) {
        this.findTestFiles(filePath, fileList)
      } else {
        if (path.extname(file) === '.js' && file.endsWith('.test.js')) {
          fileList.push(filePath)
        }
      }
    })
    return fileList
  }
  static explode(path, ignore, ...args) {
    const testr = super.explode(new this(...args))
    if (typeof path === 'string') {
      let files = testr.findTestFiles(path)
      if (ignore) {
        if (!Array.isArray(ignore))
          ignore = [ignore]
        files = files.filter(file => !ignore.includes(file))
      }
      for (const file of files)
        require(file)
    }
    return testr.run.bind(testr)
  }
}

module.exports = new Proxy(TestrNode, {
  apply (target, __, args) {
    return target.explode(...args)
  }
})
