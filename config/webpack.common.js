// Imports
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

// Relevant Directories
const mainDir = path.resolve(__dirname, '../');

module.exports = {
	entry: {
		"checkout-woocommerce-front": [mainDir + "/sources/js/vendor.js", mainDir + "/sources/ts/entry.ts", mainDir + "/sources/scss/front/front.scss"]
	},
	output: {
		filename: './assets/front/js/[name].js',
		path: path.resolve(__dirname, '../')
	},
	resolve: {
		extensions: ['.ts', '.js', '.json', '.scss']
	},
	stats: {
		colors: true
	},
	module: {
		rules: [
			// all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
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
	},
	plugins: [
		new MiniCssExtractPlugin({
			// Options similar to the same options in webpackOptions.output
			// both options are optional
			filename: './templates/default/style.css'
		})
	]
};