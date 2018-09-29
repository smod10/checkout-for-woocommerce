// Imports
const path = require('path');
const fs = require('fs');
const WebpackNotifierPlugin = require('webpack-notifier');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const FileManagerPlugin = require('filemanager-webpack-plugin');

module.exports = mode => {
	const mainModulesDir = path.resolve(__dirname, "../../node_modules");
	const localModulesDir = path.resolve(__dirname, "node_modules");
	const modulesDir = (fs.existsSync(localModulesDir)) ? localModulesDir : mainModulesDir;
	const entryName = "style";

	let entry = {};
	entry[entryName] = ["./sources/scss/style.scss"];

	let plugins = [
		/**
		 * Handles removing the singular style.js file that is always made by webpack because it can't just do single
		 * scs entry points nicely
		 */
		new FileManagerPlugin({
			onEnd: {
				delete: [
					`${entryName}.js*`,
					'./node_modules'
				]
			}
		}),
		new MiniCssExtractPlugin({
			// Options similar to the same options in webpackOptions.output
			// both options are optional
			filename: `[name]${(mode !== "development") ? '.min' : ''}.css`
		}),
	];

	if(mode === "development") {
		plugins.push(new WebpackNotifierPlugin({ alwaysNotify: true }));
	} else {
		plugins.push(new OptimizeCssAssetsPlugin())
	}

	return {
		mode: mode,
		context: __dirname,
		output: {
			path: __dirname,
		},
		devtool: (mode === "development") ? "source-map" : "",
		entry: entry,
		stats: {
			colors: true
		},
		resolve: {
			extensions: ['.scss', '.css'],
			modules: [modulesDir]
		},
		module: {
			rules: [
				{
					test: /\.(scss|css)$/,
					use: [
						MiniCssExtractPlugin.loader,
						{
							loader: 'css-loader',
							options: {
								sourceMap: true,
								minimize: false,
								url: false
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
		plugins: plugins
	};
};