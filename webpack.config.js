module.exports = {
    entry: './entry.ts',
    output: {
        filename: './assets/front/js/checkout-woocommerce-front.js'
    },
    resolve: {
        extensions: ['.webpack.js', '.web.js', '.ts', '.js']
    },
    module: {
        loaders: [
            { test: /\.ts$/, loader: 'ts-loader' }
        ]
    }
}