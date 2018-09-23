// Imports
const path = require('path');
const WebpackNotifierPlugin = require('webpack-notifier');

module.exports = {
	devtool: "source-map",
	plugins: [
		new WebpackNotifierPlugin({ alwaysNotify: true })
	]
};