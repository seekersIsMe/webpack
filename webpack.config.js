const path = require('path')
const HtmlWebpackPlugin = require ('html-webpack-plugin') // 处理 html，比如将src目下的js打包后的结果加到html中，并输出到指定目录下
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
module.exports ={
    mode: 'development', //打包模式，production development
    entry: './src/index.js', //入口，从哪里开始打包
    output: {
        // filename: 'bundle.js', // 打包后的文件名
        filename: 'bundle[hash].js', // 打包后的文件名,并加上hash，去缓存
        path: path.resolve(__dirname,'build')  // 必须是一个绝对路劲
    },
    // 开发服务的配置，用的插件是webpack-dev-server,执行的命令是npx webpack-dev-server，当然可以在package.json中配置相关命令
    devServer: {
        port: 3000, // 开发服务的端口
        progress: true, // 打包的进度条（将打包文件写进内存中）
        contentBase: './build' // 指定静态服务的根目录
    },
    // loader: {},
    plugins: [
        new HtmlWebpackPlugin(
            {
                template: './src/index.html', // 指定html模板
                filename: 'index.html',  // 打包后的文件名称
                hash:true, //打上hash戳
                minify: { // 做html的压缩
                    removeAttributeQuotes: true, // 删除html中属性双引号
                    collapseWhitespace: true // 折叠空行
                }
            }
        ),
        new  MiniCssExtractPlugin({
            filename: 'main[hash:8].css'
        }),
    ],
    // 模块
    module: {
        rules: [ //转换的规则
            {
                test: /\.css$/,
                // css-loader专门出来css模块的，例如@import这样的语法
                // style-loader专门将css插入到head标签中
                // loader的特点就是单一化
                // 单个loader可以写成字符串
                // 多个可以写成数组
                // 也可以写成一个对象
                // loader执行顺序，默认从右到左, 该例子中先处理css在将css插入到head标签中
                // use: ['style-loader', 'css-loader']
                // use: [
                //         {
                //             loader: 'style-loader',
                //             // option: {

                //             // }
                //         },
                //         {
                //             loader: 'css-loader',
                //             // option: {

                //             // }
                //         }
                // ]
                // 抽离css，不以style标签形式
                 use: [MiniCssExtractPlugin.loader, 'css-loader','postcss-loader']
                
            },
            // 先通过less-loader处理less，转成css，在通过css-loader处理css模块，最后通过style-loader处理
            // 需要安装less和less-loader
            {
              test: /\.less$/,
              use: [MiniCssExtractPlugin.loader, 'css-loader','postcss-loader', 'less-loader'] 
            }
        ]
    }
}