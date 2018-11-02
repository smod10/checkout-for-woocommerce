// Imports
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TypedocWebpackPlugin = require('typedoc-webpack-plugin');
const FileManagerPlugin = require('filemanager-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

module.exports = (mainDir, assetsDir, version, delete_min_files, travis_build) => {
	const productionDir = "./dist";
	const outPath = `${productionDir}/checkout-for-woocommerce`;
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

	if(version !== false && travis_build === false) {
		let delete_files = [
			"./docs",
			outPath + "/dist",
			outPath + "/cypress",
			outPath + "/**/node_modules",
			outPath + "/assets/front/js/checkout-woocommerce-front.js*",
			outPath + "/assets/front/css/checkout-woocommerce-front.css*",
			outPath + "/templates/**/style.css*",
			outPath + "/templates/**/theme.js*"
		];

		if(delete_min_files) {
			delete_files.push("./assets/front/**/*.min.*");
			delete_files.push("./templates/**/*.min.*");
		}

		production.plugins.push(
			new FileManagerPlugin({
				onStart: {
					delete: [
						productionDir
					]
				},
				onEnd: [
					{
						mkdir: [
							outPath
						]
					},
					{
						copy: [
							{ source: '.', destination: outPath }
						]
					},
					{
						delete: delete_files
					},
					{
						archive: [
							{ source: outPath, destination: zipName }
						]
					}
				]
			})
		)
	}

	return production;
};