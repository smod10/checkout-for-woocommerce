// Imports
const path = require('path');
const merge = require('webpack-merge');

// Relevant Directories
const mainDir = path.resolve(__dirname, '../../');
const currentDir = path.resolve(__dirname, '');

// Config Parts
const common = require(mainDir + "/config/webpack.common.js");
const development = require(mainDir + "/config/webpack.development.js");
const production = require(mainDir + "/config/webpack.production.js");

module.exports = (mode, args) => {
	let out = null;
	let template = {
		mode: mode,
		context: currentDir,
		entry: {
			"checkout-woocommerce-front": ["./sources/scss/style.scss"]
		},
		module: {
			rules: [
				{
					test: /\.(png|jpe?g|gif|svg|eot|ttf|woff|woff2)$/,
					loader: 'file-loader',
					options: {
						name: './templates/default/assets/img/[name].[ext]?[hash]',
					}
				}
			]
		}
	};

	if(mode === "development") {
		out = merge(common, development, template);
	} else {
		out = merge(common, production(args.env.version), template);
	}

	return out;
};