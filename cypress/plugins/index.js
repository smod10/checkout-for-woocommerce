// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)
let overrides = null;

try {
	overrides = require("../../cypress.overrides.json");
}catch(error) {}

module.exports = (on, config) => {
	/**
	 * Overrides are needed because the cypress.env.json file does not. I repeat does not override non environment
	 * variables. This however will.
	 */
	if(overrides !== null) {
		Object.entries(overrides).forEach( ([key, value]) => config[key] = value);
	}

	return config;
};
