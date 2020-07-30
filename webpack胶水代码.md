1. 整个是一个立即执行函数,主要内部实现了__webpack_require__去加载整合各模块的代码
> 以下举例：

*index.js*
```
const a = require('./1.js')
console.log(a)
console.log('哈哈哈哈')
```
*1.js*
```
module.exports ={
    a: 10
}
```

*webpack 打包后的代码，大概如下*
```
(
    function (modules) {
        // 缓存加载过的模块
        var installModule = {}
        // 加载各个模块代码
        function __webpack_require__(moduleId) {
            // 如果已经加载过，就直接返回
            if (installModule[moduleId]) {
                return installModule[moduleId].exports
            }
            var module = {
                isLoad: false, // 模块是否加载完成
                exports: {}, // 模块的代码
                moduleId: moduleId // 模块id,其实也就是模块的路径
            }
            installModule[moduleId] = module
            // 执行相关模块代码
            modules[moduleId].call(module.exports, module, module.exports, __webpack_require__)
            module.isLoad = true
            return module.exports
        }
        return __webpack_require__('./src/index.js') // 从入口文件开始
    }
)(
    // 这里就是模块集合对象，路径为key，具体的模块代码为value
    {
    './src/1.js': (function (module, exports, __webpack_require__) {
        eval('module.exports = {a: 10}')
    }),
    './src/index.js': (function (module, exports, __webpack_require__) {
        eval('const m = __webpack_require__("./src/1.js"); console.log(m.a);console.log("啊哈哈哈")')
    })
})
```
2. 需要安装webpack和webpack-cli
3. 执行命令
    ```
    npx webpack --config <configName>
    ```

## css的处理
1. css例如@import等语法处理：css-loader
2. css加入到html中，有style-loader、mini-css-extract-plugin（做css抽离的，将css抽离为一个文件，通过link标签的方式引入）
3. css自动加前缀：autoprefixer\postcss-loader(给css加前缀,需要postcss.config.js的配置文件)
4. css压缩： Optimize-css-assets-webpack-Plugin
 * 优化项：
 ```
 optimization: {
     minimizer: [
         new UgliftJsPlugin({
         cache: true, //是否缓存
         parallel:true, // 是否并发打包
         sourceMap: true // 是否开启sourcemap,做源码映射
        }),
        new OptimizeCSSAssetsPlugin({}) // 压缩css，必须添加这一项，不然上面的UgliftJsPlugin就不会压缩js了
     ]
 }
 ```

## js处理
1. es6语法转换
 * babel-loader、@babel/core（babel核心模块） @babel/preset-env（转化模块）
 * @babel/plugin-transform-runtime (运行转化的包), 
 * @babel/runtime(上线需要的)，例如模块转译后的的代码中出现了一些公共的工具函数，可能会重复出现在一些模块里，导致编译后的代码体积变大。Babel 为了解决这个问题，提供了单独的包 babel-runtime 供编译模块复用工具函数
 * @babel/polyfill, js补丁包
2. eslint 代码编写规范
 * eslint、 eslint-loader
3.  暴露全局变量，
 * expose-loader是内联loader
    ```
    import $ from 'expose-loader?$!jquery'

    ```
 * `new webpack.providePlugin({
        $:'jquery'
    })`

## 图片处理
 1. file-loader
 2. html-withimg-loader

## 多入口多出口
```
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

```

## sourcemap 源码映射
> 有四种配置
1. devtool: 'source-map' // 会单独生成一个sourcemap文件，出错了会标识错误的行和列，大而全
2. devtool: 'eval-source-map' // 不会生成单独的sourcemap文件，会显示行和列
3. devtool: 'cheap-module-source-map'  // 不会产生列，但是会有一个单独sourcemap文件
4. devtool: 'cheap-module-eval-source-map' // 不会产生文件，集成在打包后的文件内，不会产生列

## watch监控代码变化，代码一发生变化就打包
```
watch: true, // 是否开启
watchOptions: { // 监控选项
    poll: 1000, //  每秒检查一次变动,毫秒为单位
    aggreat: 500, // 防抖 一直输入代码
    ignored: /node_modules/    // 不需要监控的文件 
}
```

##  定义环境变量
 1. webpack.DefinePlugin插件，webpack插件 
 ```
 webpack.DefinePlugin({
     DEV: JSON.stringify('production')
 })
 ```
 
## 合并配置代码
> 使用webpack-merge
