require('dotenv').config()

const request = require('request-promise');
const PullRequest = require('./src/pull-request');
const File = require('./src/file');
const merge = require('easy-pdf-merge');

// Declare config //

const CHALLENGE = 'airport_challenge'

const requestOptions = (url) => {
  return {
    url: url,
    qs: {
      access_token: process.env.GITHUB_ACCESS_TOKEN
    },
    headers: { 'User-Agent': 'request' },
    json: true
  }
}

const isAllowedFileType = (fileUrl) => {
  return !fileUrl.includes('node_modules') 
    && !fileUrl.includes('.DS_Store')
    && !fileUrl.includes('bootstrap')
    && !fileUrl.includes('travis.yml')
    && !fileUrl.includes('.png')
    && !fileUrl.includes('.jpg')
    && !fileUrl.includes('.gif')
    && !fileUrl.includes('README') // sorry, but these are too long most of the time
    && !fileUrl.includes('INSTRUCTIONS')
    && !fileUrl.includes('Instructions')
    && !fileUrl.includes('.xml')
    && !fileUrl.includes('.gitignore')
    && !fileUrl.includes('Gemfile')
    && !fileUrl.includes('Gemfile.lock')
    && !fileUrl.includes('Procfile')
    && !fileUrl.includes('Rakefile')
    && !fileUrl.includes('rubocop')
    && !fileUrl.includes('normalize.css')
    && !fileUrl.includes('config.ru')
    && !fileUrl.includes('.rspec')
    && !fileUrl.includes('CONTRIBUTING')
    && !fileUrl.includes('rubocop')
    && !fileUrl.includes('Rakefile')
    && !fileUrl.includes('LICENSE')
    && !fileUrl.includes('spec_helper')
}

const enqueue = (file) => {
  return function(callback) {
    file
      .getPdfPath()
      .then((pdfPath) => {
        callback(file.student, pdfPath)
      });
  };
};

const visitAndRender = (queue, studentAndPdfPaths) => {
  if (queue.length === 0) {
    mergePdfs(studentAndPdfPaths);
  } else {
    queue[0](function(student, pdfPath) {
      visitAndRender(queue.slice(1),
                   mutated(studentAndPdfPaths, student, pdfPath),
                   mergePdfs);
    });
  }
};

const mutated = (studentAndPdfPaths, student, pdfPath) => {
  studentAndPdfPaths.student = student
  studentAndPdfPaths.pdfs.push(pdfPath)

  return studentAndPdfPaths
}

const mergePdfs = (studentAndPdfPaths) => {
  const student = studentAndPdfPaths.student
  const files = studentAndPdfPaths.pdfs

  if(files.length > 1) {
    console.log(`merging PDF for ${student}`)
    merge(files, `${__dirname}/finals/${student}.pdf`, (err) => {
      if(err) { return console.log(err) }
      console.log(`Successfully merged ${files.length} files for ${student}`)
    })
  } else {
    console.log(`${student} only submitted ${files.length} valid file. Skipping merge...`)
  }
}

const renderedPdfFor = async (filesForPullRequest, student) => {
  const fileQueue = await filesForPullRequest
                                .map(response => response.blob_url)
                                .filter(fileUrl => isAllowedFileType(fileUrl))
                                .map((fileUrl, index) => {
                                  return new File(fileUrl, student, index)
                                })
                                .map(file => enqueue(file))

  visitAndRender(fileQueue, { student: "", pdfs: [] })
}

const filesFor = async (pullRequest) => {
  const files = await request(requestOptions(`${pullRequest.url}/files`))
  return files
}

const getFilesByUser = (githubResponse) => {
  githubResponse
    .map(async (pullRequest) => {
      renderedPdfFor(await filesFor(pullRequest), pullRequest.user.login)
    })
}

// Execute script //

console.log('Starting...')
console.log('Requesting Pull Request URLs from Github API')

request(requestOptions(`https://api.github.com/repos/makersacademy/${CHALLENGE}/pulls`)).then((githubResponse) => {
  getFilesByUser(githubResponse)
})