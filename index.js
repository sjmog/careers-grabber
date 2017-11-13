const requestPromise = require('request-promise');
const phantom = require('phantom');

// Declare config //

const CHALLENGE = 'rps-challenge'

// Declare script functions //

const pullRequestToNamedPr = (pullRequest) => {
  return { 
    githubUsername: pullRequest.user.login, 
    url: `${pullRequest.html_url}/files?diff=unified` 
  }
}

const renderToPdf = async (namedPr, page) => {
  console.log('Rendering PDF for', namedPr.githubUsername)

  await page.render(`./scans/${namedPr.githubUsername}.pdf`)
}

const prToPdf = async (namedPr) => {
  console.log(`Visiting ${namedPr.url} with PhantomJS`)

  const instance = await phantom.create()
  const page = await instance.createPage()
  await page.on('onResourceRequested', function(requestData) {
    console.info('Requesting', requestData.url)
  });

  await page.open(namedPr.url)
  await renderToPdf(namedPr, page)

  console.log('All done! Check ./scans for the PDF scans.')
  await instance.exit()
}

const requestOptions = {
  url: `https://api.github.com/repos/makersacademy/${CHALLENGE}/pulls`,
  headers: { 'User-Agent': 'request' },
  json: true
}

// Execute script //

console.log('Starting...')
console.log('Requesting Pull Request URLs from Github API')

requestPromise(requestOptions).then((pullRequests) => {
  const namedPrs = pullRequests.map(pullRequestToNamedPr)
  
  for(var i = 0; i < namedPrs.length; i++) {
    prToPdf(namedPrs[i])
  }
})