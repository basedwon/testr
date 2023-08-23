const fs = require('fs')
const path = require('path')
const Testr = require('./testr')
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
  _success(test, indent) {
    console.log(`${indent}\x1b[${colors.green}m%s\x1b[0m`, '✔ ', test.description)
  }
  _error(error, test, indent) {
    console.error(`${indent}\x1b[${colors.red}m%s\x1b[0m`, '✘ ', test.description)
  }
  static findTestFiles(dir, fileList = []) {
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
    const testr = super.explode(...args)
    if (typeof path === 'string') {
      let files = this.findTestFiles(path)
      if (ignore) {
        if (!Array.isArray(ignore)) ignore = [ignore]
        files = files.filter(file => !ignore.includes(file))
      }
      for (const file of files) require(file)
    }
    return testr
  }
}

module.exports = TestrNode.proxy()
