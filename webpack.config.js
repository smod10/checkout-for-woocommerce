// Imports
const path = require('path');
const merge = require('webpack-merge');

// Config Parts
const common = require("./config/webpack.common.js");
const development = require("./config/webpack.development.js");
const production = require("./config/webpack.production.js");

const sourcesDir = "./sources";
const assetsDir = "./assets";

module.exports = mode => {
	let config = {
		mode: mode,
		context: __dirname
	};

	if(mode === "development") {
		return merge(common(sourcesDir), development(assetsDir), config);
	}

	return merge(common(sourcesDir), production(assetsDir, process.env.npm_package_version), config);
};