const path = require('path')
const HtmlWebpackPlugin = require ('html-webpack-plugin') // 处理 html，比如将src目下的js打包后的结果加到html中，并输出到指定目录下
const MiniCssExtractPlugin = require('mini-css-extract-plugin') // css抽离，通过link标签形式引入css
const UgliftJsPlugin = require('uglifyjs-webpack-plugin') // js压缩
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const {CleanWebpackPlugin} = require('clean-webpack-plugin') // 清除目录
const CopyWebpackPlugin = require('copy-webpack-plugin') // 复制
const webpack = require('webpack')
const glob = require('glob')
class testPlugin {
    apply(compiler) {
        compiler.hooks.done.tap('testPlugin', (stats) =>{
            const list = glob.sync(path.join(stats.compilation.outputOptions.path, `./**/*.{js.map,}`))
            // console.log('compiler对象',stats)
        })
        compiler.hooks.emit.tap('test', (stats)=>{
            // console.log('独显',stats)
        })
    }
}

module.exports ={
    mode: 'production', //打包模式，production development
    entry: './src/index.js', //入口，从哪里开始打包
    output: {
        // filename: 'bundle.js', // 打包后的文件名
        filename: 'bundle[hash].js', // 打包后的文件名,并加上hash，去缓存
        path: path.resolve(__dirname,'build'),  // 必须是一个绝对路劲
        // publicPath:'' // 资源公共路径,例如静态资源放在cdn
    },
    // 开发服务的配置，用的插件是webpack-dev-server,执行的命令是npx webpack-dev-server，当然可以在package.json中配置相关命令
    devServer: {
        port: 3000, // 开发服务的端口
        progress: true, // 打包的进度条（将打包文件写进内存中）
        contentBase: './build' // 指定静态服务的根目录
    },
    // watch: true, // 是否开启
    // watchOptions: { // 监控选项
    //     poll: 1000, //  每秒检查一次变动,毫秒为单位
    //     aggregateTimeout: 500, // 防抖 一直输入代码
    //     ignored: /node_modules/    // 不需要监控的文件 
    // },
    // optimization: {
    //     minimizer: [
    //         new UgliftJsPlugin({
    //         cache: true, //是否缓存
    //         parallel:true, // 是否并发打包
    //         sourceMap: true // 是否开启sourcemap,做源码映射
    //        }),
    //        new OptimizeCSSAssetsPlugin({}) // 压缩css，必须添加这一项，不然上面的UgliftJsPlugin就不会压缩js了
    //     ]
    // },
    devtool: 'source-map',
    plugins: [
        new HtmlWebpackPlugin(
            {
                template: './src/index.html', // 指定html模板
                filename: 'index.html',  // 打包后的文件名称
                hash:true, //打上hash戳
                // minify: { // 做html的压缩
                //     removeAttributeQuotes: true, // 删除html中属性双引号
                //     collapseWhitespace: true // 折叠空行
                // }
                minify:false
            }
        ),
        new  MiniCssExtractPlugin({
            filename: 'main[hash:8].css'
        }),
        new OptimizeCSSAssetsPlugin({}),
        // new UgliftJsPlugin({
        //             cache: true, //是否缓存
        //             parallel:true, // 是否并发打包
        //             sourceMap: true // 是否开启sourcemap,做源码映射
        //     }),
       new CleanWebpackPlugin(),
       new CopyWebpackPlugin({
            patterns: [
                { from: './doc', to: './doc' }
            ]
        }),
        new testPlugin()
        // 
    //    new webpack.DllReferencePlugin({
    //        manifest: path.resolve(__dirname, 'dist', 'manifest.json')
    //    }) 
    ],
    
    resolveLoader: {
        modules: ['node_modules', path.resolve(__dirname, 'loaders')]
    },
    // 模块
    module: {
        rules: [ //转换的规则
            {
                test: /\.html$/,
                use: 'html-withimg-loader'
            },
            {
                test: /\.(png|jpg|gif)$/,
                // 做一个限制，当我们的图片小于多少k的时候用base64来转化
                // 否则用file-loader来产生真实图片
                use: {
                  loader: 'url-loader',
                  options: {
                      limit: 200*1024,
                      outputPath: '/img/',
                      publicPath: '' // 图片路径的公共前缀
                  }  
                } 
            },
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
                //             // options: {

                //             // }
                //         },
                //         {
                //             loader: 'css-loader',
                //             // options: {

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
            },
            // {
            //     test: /\.js$/,
            //     use: {
            //         loader: 'eslint-loader',
            //         options: {
            //             enforce: 'pre' // 强制在下面的babel-loader之前执行
            //         }
            //     },
            // },
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/, //排除
                include: path.resolve(__dirname, 'src'), // 处理src目录下的js
                use: [
                    {
                        loader: 'test-loader'
                    },
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: ['@babel/preset-env'], //预设用@babel/preset-env这个插件转换js
                            //小的插件
                            plugins: [
                                ["@babel/plugin-proposal-decorators", { "legacy": true }],
                                ["@babel/plugin-proposal-class-properties", { "loose" : true }],
                                "@babel/plugin-transform-runtime"
                            ]
                        },
                    }
                ] 
                
            }
        ]
    }
}