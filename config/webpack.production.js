// Imports
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TypedocWebpackPlugin = require('typedoc-webpack-plugin');
const FileManagerPlugin = require('filemanager-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

module.exports = (mainDir, assetsDir, version) => {
	const productionDir = "./dist";
	const docsDir = "./docs";
	const outPath = `${productionDir}/checkout-for-woocommerce`;
	const unMinJS = `${assetsDir}/front/js/*.js*`;
	const unMinCSS = `${assetsDir}/front/css/*.css*`;
	const zipName = `${outPath}-${version}.zip`;

	let production = {
		optimization: {
			minimizer: [new UglifyJsPlugin()]
		},
		output: {
			filename: `${assetsDir}/front/js/[name].min.js`,
			path: mainDir
		},
		plugins: [
			new MiniCssExtractPlugin({
				// Options similar to the same options in webpackOptions.output
				// both options are optional
				filename: `${assetsDir}/front/css/[name].min.css`
			}),
			new OptimizeCssAssetsPlugin(),
			new TypedocWebpackPlugin({
				out: `${mainDir}/docs/ts`,
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
						productionDir,
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
						docsDir
					],
					archive: [
						{ source: outPath, destination: zipName },
					]
				}
			})
		)
	}

	return production;
};