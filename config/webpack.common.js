// Imports
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = sourcesDir => {
	return {
		entry: {
			"checkout-woocommerce-front": [
				`${sourcesDir}/js/vendor.js`,
				`${sourcesDir}/ts/entry.ts`,
				`${sourcesDir}/scss/front/front.scss`
			]
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
	}
};