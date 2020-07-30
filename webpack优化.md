## module.noParse
> 可以用于配置哪些模块文件的内容不需要进行解析。对于一些不需要解析依赖（即无依赖） 的第三方大型类库等，可以通过这个字段来配置，以提高整体的构建速度 
**使用 noParse 进行忽略的模块文件中不能使用 import、require、define 等导入机制。**
```
module.exports = {
  // ...
  module: {
    noParse: /jquery|lodash/, // 正则表达式

    // 或者使用 function
    noParse(content) {
      return /jquery|lodash/.test(content)
    }
  }
}

```
## loader 的排除和包含 exclude\include

## IgnorePlugin(webpack内置插件) 忽略某些模块 例如moment.js日期类库，里面有许多i18n代码，导致打包后的文件较大，而实际场景又不需要这些，忽略本地化的内容 new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),所需要的语言包就需要手动引入

## 动态链接库
1. webpack.DllPulgin,单独先打包好第三方库。例如：webpack.react.js
2. webpack.DllReferencePlugin引用，如果有就不打包，没有需要打包第三方库

## happypack 多线程打包

## webpack自带的功能 
* tree-shaking
 1. 在生产模式下，import的模块，会自动去掉没用的代码，但是require的模块会把结果放在default上，并且不会去掉没用的代码
   **所以前端开发的时候要用import**
* 会自动简化、省略一些代码

## 抽离公共代码
```
     optimization: {
        splitChunks: {  //分割代码块
            cacheGroups: { // 缓存组
                common: {  // 功能模块
                    chunks: 'initial', // 从入口就开始抽离
                    minSize: 0, // 代码块最小
                    minChunks: 2 // 代码块被使用的最少次数
                }
            }
        }
    }
```
