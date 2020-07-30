// 抽离公共代码
const path = require('path')
module.exports = {
    entry: {
        index: './src/index.js',
        other: './src/other.js'
    },
    output: {
        filename: '[name][hash:8].js',
        path: path.resolve(__dirname, 'build')
    },
    optimization: {
        splitChunks: {
            cacheGroups: {
                common: {
                    chunks: 'initial',
                    minSize: 0,
                    minChunks: 2
                }
            }
        }
    }
}