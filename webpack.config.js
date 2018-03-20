let webpack = require('webpack');
let ExtractTextPlugin = require("extract-text-webpack-plugin");
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
        filename: inProduction ? './assets/front/js/[name].min.js' : './assets/front/js/[name].js' //relative to root of the application
    },
    resolve: {
        extensions: ['.webpack.js', '.web.js', '.ts', '.js']
    },
    devtool: "source-map",
    module: {
        rules: [
            // all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
            {
                test: /\.ts$/,
                loader: ['ts-loader']
            },
            {
                test: [/\.s[ac]ss$/, /\.css$/],
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: [
                        {
                            loader: "css-loader",
                            options: {
                                sourceMap: true
                            }
                        },
                        {
                            loader: "sass-loader",
                            options: {
                                sourceMap: true
                            }
                        }
                    ]
                })
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
        new ExtractTextPlugin( inProduction ? './assets/front/css/checkout-woocommerce-front.min.css' : './assets/front/css/checkout-woocommerce-front.css'),
        new WebpackNotifierPlugin({ alwaysNotify: true }),
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