# Code Grabber

Grabs code from Makers Academy challenge PRs, and prints to PDF for upload to No More Marking.

Prototypes using ACJ for code quality assessment.

## Getting Started

- `npm install`. 
- Change the `CHALLENGE` constant (in ./index.js) to the name of the challenge you want to download. (Default is `rps-challenge`)
- Run the program with `node index.js` or `npm start`

Once you've grabbed all the files:

- Check the cohort is all there in ./scans
- Close all completed challenge Pull Requests so it's ready for next time.
- Head to [No More Marking](https://www.nomoremarking.com/), set up a new task, and upload the PDFs as scans.

## How does it work

1. Grab open PRs from the Github API, along with the Github username of the submitter.
2. Use PhantomJS to browse to the Unified Files view of the PR.
3. Render the PR as a PDF, with the Github username of the submitter as the title.