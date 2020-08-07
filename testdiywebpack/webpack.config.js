const path = require('path')
const testPlugin = require('./plugins/testPlugin')
module.exports = {
    entry: './src/index.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    module: {
        rules: [
            {
                test: /\.less$/,
                use: [
                    path.resolve(__dirname, 'loader', 'style-loader.js'),
                    path.resolve(__dirname, 'loader', 'less-loader.js')
                ]
            }
        ]
    },
    plugins: [
       new testPlugin()
    ]
}