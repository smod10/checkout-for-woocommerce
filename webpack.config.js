let webpack = require('webpack');
let path = require('path');
let MiniCssExtractPlugin = require('mini-css-extract-plugin');
let WebpackNotifierPlugin = require('webpack-notifier');
let CopyWebpackPlugin = require('copy-webpack-plugin');
let CleanWebpackPlugin = require('clean-webpack-plugin');
let WebpackZipPlugin = require('webpack-zip-plugin');
let TypedocWebpackPlugin = require('typedoc-webpack-plugin');

let inProduction = (process.env.NODE_ENV === 'production');
let version = get_argv_param('env.version') || false;

const buildDir = './checkout-for-woocommerce';

function get_argv_param(param){
    let result = '';
    process.argv.forEach((argv)=>{
        if(argv.indexOf('--' + param) === -1) return;
        result = argv.split('=')[1];
    });
    return  result;
}

module.exports = {
    context: __dirname,
    entry: {
        "checkout-woocommerce-front": ["./sources/js/vendor.js", './sources/ts/entry.ts']
    },
    output: {
        filename: inProduction ? './assets/front/js/[name].min.js' : './assets/front/js/[name].js', //relative to root of the application
	    path: path.resolve(__dirname, '')
    },
    resolve: {
        extensions: ['.webpack.js', '.web.js', '.ts', '.js']
    },
	stats: {
		colors: true
	},
    mode: 'development',
    devtool: "source-map",
    module: {
        rules: [
            // all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
            {
                test: /\.ts$/,
                loader: ['ts-loader']
            },
	        {
		        test: /\.(scss|css)$/,
		        include: path.resolve('./sources/scss/front'),
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
	        },
            {
                test: /\.(png|jpe?g|gif|svg|eot|ttf|woff|woff2)$/,
                loader: 'file-loader',
                options: {
                    name: './assets/front/img/[name].[ext]?[hash]',
                    publicPath: '../../../'
                }
            }
        ]
    },
    plugins: [
        new WebpackNotifierPlugin({ alwaysNotify: true }),
	    new MiniCssExtractPlugin({
		    // Options similar to the same options in webpackOptions.output
		    // both options are optional
		    filename: inProduction ? './assets/front/css/checkout-woocommerce-front.min.css' : './assets/front/css/checkout-woocommerce-front.css'
	    }),
        new TypedocWebpackPlugin({
            out: './docs/ts',
            module: 'commonjs',
            target: 'es5',
            exclude: '**/node_modules/**/*.*',
            experimentalDecorators: true,
            excludeExternals: true
        })
    ]
};

if ( inProduction ) {
    module.exports.plugins.push(
        new CleanWebpackPlugin(
            'dist',
            {
                verbose: true
            }
        ),
        new CleanWebpackPlugin(
            'checkout-for-woocommerce',
            {
                verbose: true
            }
        ),
        new CopyWebpackPlugin(
            [
                {
                    from:'.',
                    to:'dist/checkout-for-woocommerce',
                    ignore: ['node_modules/**', 'dist/**', '.git/**', '.gitignore'],
                    transform: function(content, path) {

                        return content;
                    }
                }
            ]
        )
    )
}

if ( inProduction && version !== false ) {
    module.exports.plugins.push(new CopyWebpackPlugin(
        [
            {
                from:'.',
                to:'checkout-for-woocommerce',
                ignore: ['node_modules/**', 'dist/**', '.git/**', '.gitignore'],
                transform: function(content, path) {

                    return content;
                }
            }
        ]
    ));

    module.exports.plugins.push(
        new WebpackZipPlugin({
            initialFile: 'checkout-for-woocommerce && rm -rf ' + buildDir,
            endPath: './dist',
            zipName: 'checkout-for-woocommerce-' + version + '.zip'
        })
    );
}