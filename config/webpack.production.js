// Imports
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TypedocWebpackPlugin = require('typedoc-webpack-plugin');
const FileManagerPlugin = require('filemanager-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

// Paths
const mainDir = path.resolve(__dirname, '../');
const baseDistDir = "dist";
const zipBaseName = "checkout-for-woocommerce";
const outPath = baseDistDir + '/' + zipBaseName;
const unMinJS = "assets/front/js/*.js*";
const unMinCSS = "templates/**/*.css*";

module.exports = version => {
	let production = {
		optimization: {
			minimizer: [new UglifyJsPlugin()]
		},
		output: {
			filename: './assets/front/js/[name].min.js',
			path: path.resolve(__dirname, '../')
		},
		plugins: [
			new MiniCssExtractPlugin({
				// Options similar to the same options in webpackOptions.output
				// both options are optional
				filename: './templates/default/style.min.css'
			}),
			new OptimizeCssAssetsPlugin(),
			new TypedocWebpackPlugin({
				out: mainDir + '/docs/ts',
				module: 'commonjs',
				target: 'es5',
				exclude: '**/node_modules/**/*.*',
				experimentalDecorators: true,
				excludeExternals: true
			})
		]
	};

	if(version !== false) {
		production.plugins.push(
			new FileManagerPlugin({
				onStart: {
					delete: [
						baseDistDir,
						unMinJS,
						unMinCSS
					]
				},
				onEnd: {
					mkdir: [
						outPath
					],
					copy: [
						{ source: './assets', destination: outPath + '/assets' },
						{ source: './config', destination: outPath + '/config' },
						{ source: './includes', destination: outPath + '/includes' },
						{ source: './languages', destination: outPath + '/languages' },
						{ source: './sources', destination: outPath + '/sources' },
						{ source: './templates', destination: outPath + '/templates' },
						{ source: './typings', destination: outPath + '/typings' },
						{ source: './vendor', destination: outPath + '/vendor' },
						{ source: './docs', destination: outPath + '/docs' },
						{ source: './*.php', destination: outPath },
						{ source: './*.js', destination: outPath },
						{ source: './*.md', destination: outPath },
						{ source: './*.json', destination: outPath }
					],
					delete: [
						'docs'
					],
					archive: [
						{ source: outPath, destination: outPath + "-" + version + ".zip" },
					]
				}
			})
		)
	}

	return production;
};