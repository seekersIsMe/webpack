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
     new UgliftJsPlugin({
         cache: true, //是否缓存
         parallel:true, // 是否并发打包
         sourceMap: true // 是否开启sourcemap,做源码映射
     }),
     new OptimizeCSSAssetsPlugin({}) // 压缩css，必须添加这一项，不然上面的UgliftJsPlugin就不会压缩js了
 }
 ```
