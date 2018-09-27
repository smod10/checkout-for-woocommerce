// Imports
const path = require('path');
const fs = require('fs');
const WebpackNotifierPlugin = require('webpack-notifier');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const FixStyleOnlyEntriesPlugin = require("webpack-fix-style-only-entries");

module.exports = mode => {
	const mainModulesDir = path.resolve(__dirname, "../../node_modules");
	const localModulesDir = path.resolve(__dirname, "node_modules");
	const modulesDir = (fs.existsSync(localModulesDir)) ? localModulesDir : mainModulesDir;

	let plugins = [
		new FixStyleOnlyEntriesPlugin(),
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
		entry: {
			"style": ["./sources/scss/style.scss"]
		},
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
								minimize: false
							}
						},
						{
							loader: 'sass-loader',
							options: {
								sourceMap: true
							}
						}
					]
				},
				{
					test: /\.(png|jpe?g|gif|svg|eot|ttf|woff|woff2)$/,
					loader: 'file-loader',
					options: {
						name: 'assets/img/[name].[ext]?[hash]',
						publicPath: '../../'
					}
				}
			]
		},
		plugins: plugins
	};
};