const PullRequest = function(pullRequestData) {
  this.githubUsername = pullRequestData.user.login
  this.url = `${pullRequestData.html_url}/files?diff=unified`

  this.toPdf = async (instance, page) => {
    console.log('Opening with PhantomJS', this.url)
    await page.open(this.url)

    console.log('Rendering PDF for', this.githubUsername)
    await page.render(`./scans/${this._filename()}`)

    await instance.exit()
  }

  this._filename = () => {
    return `${this.githubUsername}.pdf`
  }
}

module.exports = PullRequest