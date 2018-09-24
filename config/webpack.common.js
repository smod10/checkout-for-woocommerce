// Imports
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

// Relevant Directories
const mainDir = path.resolve(__dirname, '../');

module.exports = {
	entry: {
		"checkout-woocommerce-front": [mainDir + "/sources/js/vendor.js", mainDir + "/sources/ts/entry.ts", mainDir + "/sources/scss/front/front.scss"]
	},
	resolve: {
		extensions: ['.ts', '.js', '.json', '.scss']
	},
	stats: {
		colors: true
	},
	module: {
		rules: [
			{
				test: /\.ts$/,
				loader: ['ts-loader']
			},
			{
				test: /\.(scss|css)$/,
				use: [
					MiniCssExtractPlugin.loader,
					{
						loader: 'css-loader',
						options: {
							sourceMap: true,
							minimize: false
						}
					},
					{
						loader: 'postcss-loader',
						options: {
							sourceMap: true
						}
					},
					{
						loader: 'sass-loader',
						options: {
							sourceMap: true
						}
					}
				]
			}
		]
	}
};