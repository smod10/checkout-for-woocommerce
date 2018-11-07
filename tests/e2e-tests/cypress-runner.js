const cypress = require('cypress');
const fs = require('fs');
const deleteEmpty = require('delete-empty');

let testAttempts = 0;
let retryAmt = 1;

let specs = [
	"cypress/integration/customer/**/*",
	"cypress/integration/general/**/*",
	"cypress/integration/payment/billing-fields-spec.js"
];

let config = { spec: specs };

function deleteSuccessVideos(results) {
	// Loop over each run and if the shouldUploadVideo flag is false, delete the video
	results.runs.forEach(run => (!run.shouldUploadVideo) ? fs.unlinkSync(run.video) : null);

	// Delete empty directories from the videos folders
	deleteEmpty("cypress/videos/").catch(console.error);

	// If any of the tests failed throw an error and exit with 1 in the catch
	if(results.totalFailed > 0) {
		throw new Error();
	}
}

function error(err) {
	if(testAttempts < retryAmt) {
		testAttempts++;
		console.log("Attempting tests one more time");
		cypress.run(config).then(deleteSuccessVideos).catch(error);
	} else {
		process.exit(1);
	}
}

cypress.run(config).then(deleteSuccessVideos).catch(error);