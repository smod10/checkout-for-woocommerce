// Imports
const path = require('path');
const WebpackNotifierPlugin = require('webpack-notifier');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
	output: {
		filename: './assets/front/js/[name].js',
		path: path.resolve(__dirname, '../')
	},
	devtool: "source-map",
	plugins: [
		new WebpackNotifierPlugin({ alwaysNotify: true }),
		new MiniCssExtractPlugin({
			// Options similar to the same options in webpackOptions.output
			// both options are optional
			filename: './templates/default/style.css'
		})
	]
};