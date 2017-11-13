const requestPromise = require('request-promise');
const PullRequest = require('./src/pull-request');
const phantom = require('phantom');

// Declare config //

const CHALLENGE = 'rps-challenge'

const requestOptions = {
  url: `https://api.github.com/repos/makersacademy/${CHALLENGE}/pulls`,
  headers: { 'User-Agent': 'request' },
  json: true
}

const handle = async (githubResponse) => {
  const pullRequests = githubResponse.map(pullRequestData => new PullRequest(pullRequestData))
  
  for(var i = 0; i < pullRequests.length; i++) {
    const instance = await phantom.create()
    const page     = await instance.createPage()
    await page.on('onResourceRequested', function(requestData) {
      console.info('Requesting', requestData.url)
    })

    pullRequests[i].toPdf(instance, page)
  }
}

// Execute script //

console.log('Starting...')
console.log('Requesting Pull Request URLs from Github API')

requestPromise(requestOptions).then((githubResponse) => {
  handle(githubResponse)
})