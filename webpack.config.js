var webpack = require('webpack');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var WebpackNotifierPlugin = require('webpack-notifier');
var inProduction = (process.env.NODE_ENV === 'production');

module.exports = {
    context: __dirname,
    entry: {
        "checkout-woocommerce-front": ["./sources/js/vendor.js", './entry.ts']
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
                    name: './assets/front/img/[name].[hash].[ext]'
                }
            }
        ]
    },
    plugins: [
        new ExtractTextPlugin( inProduction ? './assets/front/css/checkout-woocommerce-front.min.css' : './assets/front/css/checkout-woocommerce-front.css'),
        new WebpackNotifierPlugin({ alwaysNotify: true })
    ]
};