# Code Grabber

Grabs code from Makers Academy challenge PRs, and prints to PDF for upload to No More Marking.

Prototypes using ACJ for code quality assessment.

## Getting Started

- `npm install`. 
- Change the `CHALLENGE` constant (in ./index.js) to the name of the challenge you want to download. (Default is `news-summary-challenge`)
- Grab a Github Access Token, add a `.env` and put it in like `GITHUB_ACCESS_TOKEN=your-token-here`.
- Run the program with `npm start`

> This program will basically seize up your internet for around 10 minutes. Be warned!

Once you've grabbed all the files:

- Check the cohort is all there in ./finals
- Close all completed challenge Pull Requests so it's ready for next time.
- Head to [No More Marking](https://www.nomoremarking.com/), set up a new task, and upload the finals PDFs as scans.

## How does it work

1. Grab open PRs from the Github API, along with the Github username of the submitter.
2. For each PR, grab the list of files.
3. Stick each file into a Queue.
4. For each file in the queue, use PhantomJS to browse to the file in a browser, one-by-one and render as a PDF in /scans, with a filename of `file-githubusername-number.pdf`.
5. Once a student's queue is through, use `easy-pdf-merge` to merge these PDFs together. Output the final PDF in /finals, with the filename `githubusername.pdf`.
6. Once the whole queue is done, stop.

**Note: Anyone who submits fewer than 2 non-excluded files doesn't get merged.**

## Excluding files

You can exclude certain files.

Inside index.js, add a substring that will exclude a file to `isAlowedFileType`