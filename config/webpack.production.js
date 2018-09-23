// Imports
const path = require('path');
const TypedocWebpackPlugin = require('typedoc-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const WebpackZipPlugin = require('webpack-zip-plugin');

// Paths
const mainDir = path.resolve(__dirname, '../');

module.exports = version => {
	let production = {
		plugins: [
			new TypedocWebpackPlugin({
				out: mainDir + '/docs/ts',
				module: 'commonjs',
				target: 'es5',
				exclude: '**/node_modules/**/*.*',
				experimentalDecorators: true,
				excludeExternals: true
			}),
			new CleanWebpackPlugin(
				['dist', 'checkout-for-woocommerce'],
				{
					verbose: true,
					root: mainDir
				}
			),
			new CopyWebpackPlugin(
				[
					{
						from: mainDir,
						to: 'dist/checkout-for-woocommerce',
						ignore: ['node_modules/**', 'dist/**', '.git/**', '.gitignore', '.idea/**'],
						transform: function(content, path) {
							return content;
						}
					}
				]
			)
		]
	};

	console.log("Version: ", version);

	if(version !== false) {
		production.plugins.push(new CopyWebpackPlugin(
			[
				{
					from:'.',
					to:'checkout-for-woocommerce',
					ignore: ['node_modules/**', 'dist/**', '.git/**', '.gitignore', '.idea/**'],
					transform: function(content, path) {

						return content;
					}
				}
			]
		));

		production.plugins.push(
			new WebpackZipPlugin({
				initialFile: 'checkout-for-woocommerce && rm -rf ' + mainDir + '/checkout-for-woocommerce' + ' && rm -rf ' + mainDir + '/docs',
				endPath: mainDir + '/dist',
				zipName: 'checkout-for-woocommerce-' + version + '.zip'
			})
		)
	}

	return production;
};