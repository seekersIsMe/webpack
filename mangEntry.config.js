const path = require('path');
const HtmlWebpackPlugin = require ('html-webpack-plugin')
module.exports = {
    entry: { // 多个入口
        home: './src/index.js',
        other: './src/other.js'
    },
    output:{
        filename: '[name][hash:8].js', // [name] 入口js名字
        path: path.resolve(__dirname, 'build')
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html', // 指定html模板
            filename: 'index.html',  // 打包后的文件名称
            hash: true, //打上hash戳
            minify: { // 做html的压缩
                removeAttributeQuotes: true, // 删除html中属性双引号
                collapseWhitespace: true // 折叠空行
            },
            chunks: ['home'] // 将对应入口的js加到html中
        }),
        new HtmlWebpackPlugin({
            template: './src/index.html', // 指定html模板
            filename: 'other.html',  // 打包后的文件名称
            hash: true, //打上hash戳
            minify: { // 做html的压缩
                removeAttributeQuotes: true, // 删除html中属性双引号
                collapseWhitespace: true // 折叠空行
            },
            chunks: ['other']  //将对应入口的js加到html中
        }),
    ]
}
