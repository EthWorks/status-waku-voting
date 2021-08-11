const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
const webpack = require('webpack')

module.exports = (env) => {
    let environment = 'development'
    if (env.ENV) {
        environment = env.ENV
    }

    return {
        entry: './src/index.tsx',
        output: {
            filename: 'index.[fullhash].js',
            path: path.join(__dirname, 'dist'),
            publicPath: "/",
        },
        devtool: 'source-map',
        resolve: {
            extensions: ['.ts', '.tsx', '.js', '.json'],
            fallback: {
                "buffer": require.resolve("buffer/"),
                "crypto": require.resolve("crypto-browserify"),
                "stream": require.resolve("stream-browserify")
            }
        },
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    use: 'ts-loader',
                    exclude: /node_modules/,
                },
                {
                    enforce: 'pre',
                    test: /\.js$/,
                    exclude: /node_modules/,
                    loader: 'source-map-loader'
                },
                {
                    test: /\.(png|svg|jpg|gif|woff|woff2|eot|ttf|otf|ico)$/,
                    use: ['file-loader'],
                },
            ],
        },
        plugins: [
            new ForkTsCheckerWebpackPlugin(),
            new HtmlWebpackPlugin({
                template: 'src/index.html',
            }),
            new webpack.DefinePlugin({
                'process.env.ENV': JSON.stringify(environment),
            }),
            new webpack.ProvidePlugin({
                process: 'process/browser.js',
                Buffer: ['buffer', 'Buffer'],
            }),
        ],
        devServer: {
            historyApiFallback: true,
            host: '0.0.0.0',
            stats: 'errors-only',
            overlay: true,
            hot: true,
        },
        stats: 'minimal'
    }
}