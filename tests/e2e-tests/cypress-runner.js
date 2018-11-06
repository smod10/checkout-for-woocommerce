const cypress = require('cypress');
const fs = require('fs');
const deleteEmpty = require('delete-empty');

cypress.run({
	spec: [
		"cypress/integration/customer/**/*",
		"cypress/integration/general/**/*",
		"cypress/integration/shipping/**/*",
		"cypress/integration/payment/billing-fields-spec.js"
	]
}).then(results => {
	// Loop over each run and if the shouldUploadVideo flag is false, delete the video
	results.runs.forEach(run => (!run.shouldUploadVideo) ? fs.unlinkSync(run.video) : null);

	// Delete empty directories from the videos folders
	deleteEmpty("cypress/videos/").catch(console.error);

	// If any of the tests failed throw an error and exit with 1 in the catch
	if(results.totalFailed > 0) {
		throw new Error();
	}
}).catch(err => {
	process.exit(1);
});