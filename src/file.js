const phantom = require('phantom');
const path = require('path');

const File = function(url, student, number) {
  this.url = url
  this.student = student
  this.number = number

  this.getPdfPath = async () => {
    console.log(`creating Phantom Instance to fetch ${this._filename()}`)
    const instance = await phantom.create()
    const page     = await instance.createPage()
    await page.on('consoleMessage', (msg) => { return null })

    console.log(`PhantomJS loading file ${this.number} for ${this.student}...`)
    await page.open(this.url)

    console.log(`Rendering PDF fragment ${this.number} for ${this.student}`)
    await page.render(`./scans/${this._filename()}`)

    await instance.exit()

    return `${path.join(__dirname, '..', 'scans')}/${this._filename()}`
  }

  this._filename = () => {
    return `file-${this.student}-${this.number}.pdf`
  }
}

module.exports = File