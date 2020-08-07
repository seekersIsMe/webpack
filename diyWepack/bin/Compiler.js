const fs = require('fs')
const path = require('path')
const acorn = require('acorn')
const traverse = require('@babel/traverse').default
const t = require('@babel/types')
const generator = require('@babel/generator').default
const ejs = require('ejs')
const parserCode = require('@babel/parser').parse;
const tapable = require('tapable')
module.exports = class Compiler {
    constructor (config) {
        this.config = config
        this.entryId = config.entry  // 入口目录
        this.modules = {}
        this.root = process.cwd() //process.cwd() 方法会返回 Node.js 进程的当前工作目录, 
        // C:\Users\admin\Desktop\webpack0.1\testdiywebpack
        this.hooks = {
            beforeEntry: new tapable.SyncHook(), // 传入参数之前
            beforeCompiler: new tapable.SyncHook(), // 编译之前
            afterCompiler: new tapable.SyncHook(), // 编译之后
            beforeEmitFile: new tapable.SyncHook(),  // 写入文件前
            afterEmitFile: new tapable.SyncHook(), // 写入文件后
            afterPlugin: new tapable.SyncHook(), // 插件都运行完后
            beforeRun: new tapable.SyncHook(), // 开始运行之前
            end: new tapable.SyncHook() // 生命周期结束
        }
         // 挂载plugin 插件
        let plugins = this.config.plugins
        if(Array.isArray(plugins)) {
            plugins.forEach(p =>{
                p.apply(this)
            })
            this.hooks.afterPlugin.call()
        }
    }
    run () {
        // 传入入口文件的绝对路径，构建模块依赖
        this.hooks.beforeRun.call()
        this.hooks.beforeCompiler.call()
        this.buildModule(path.resolve(this.root, this.entryId), true)
        this.hooks.afterCompiler.call()
        this.hooks.beforeEmitFile.call()
        // 将代码块组装写入文件
        this.emitFile()
        this.hooks.afterEmitFile.call()
        this.hooks.end.call()
    }
    // 构建模块
    /*
    * url绝对路径
    * isEntry是否是入口文件
    */
    buildModule(url, isEntry) {
        // 同步获取源码
        let soucerCode =this.getSource(url)
        // 获取源码的相对根目录的相对路径, 例如用'./src/index.js' 作为index.js模块的key值
        let moduleName = this.changePath(`./` + path.relative(this.root, url))
        //  path.dirname(moduleName) 获取父路径 
        let {moduleCode, dependencies} = this.parse(soucerCode, path.dirname(moduleName))
        this.modules[moduleName] = moduleCode
        // 递归遍历收集依赖
        if (dependencies.length>0) {
            dependencies.forEach(p =>{
                this.buildModule(path.join(this.root, p), false)
            })
        }
    }
    // 将window的正斜杠转成反斜杠
    changePath(url) {
        return url.replace(/\\/g,"/");
    }
    // 获取源码
    getSource (url) {
        let rules = this.config.module.rules
        let soucerCode = fs.readFileSync(url)
        // 在这里匹配loader
        for (let i = 0;i < rules.length;i++) {
            let {test, use } =  rules[i]
            if(test.test(url)) {
                for (let j = use.length - 1;j > 0; j--) {
                    // let loader = require(use[j])
                    // soucerCode = loader(soucerCode)
                }  
                let len = use.length-1
                // 循环调用loader
                function normalLoader () {
                     let loader = require(use[len--])
                     soucerCode = loader(soucerCode)
                     if(len >= 0) {
                        normalLoader()
                     }
                } 
                normalLoader()
            }
        }
        
        return soucerCode
    }
    /**
     * 解析源码 AST解析语法树
     * soucerCode 源码
     * parentPath 附路径
     * 
     * * 使用的库有：
     * 1. @babel/parser和 acorn（webpack使用的库） 将代码转成AST语法树
     * 2. @babel/traverse遍历节点
     * 3. @babel/types 节点替换，将require替换成__webpack_require__（webpack自己写得一个require方法）
     * 4. @babel/generator 将替换好的AST语法树转成代码字符串
     */
    /// https://astexplorer.net/
    parse (soucerCode, parentPath) {
        // console.log('soucerCode源码', soucerCode.toString())
        let that = this
        let Ast = parserCode(soucerCode.toString())
        // console.log('ast', Ast)
        // 依赖路径 ./src/other.js
        let dependencies = []
        // 遍历节点，并修改require为__webpack_require__， 依赖路径为module名称
        traverse(Ast, {
            CallExpression(p){ // 调用表达式，对ast中的调用表达式做处理的回调函数
                let node = p.node
                if(node.callee.name === 'require') {
                    node.callee.name = '__webpack_require__'
                    let moduleName = node.arguments[0].value // ./other
                    // 看有没有扩展名
                    moduleName = moduleName + (path.extname(moduleName)? '': '.js')
                    // 拼接路径，父路径加文件相对路径
                    moduleName = that.changePath('./' + path.join(parentPath, moduleName)) // ./src/other.js
                    // console.log('模块名', moduleName)
                    dependencies.push(moduleName)
                    // 将源码中依赖改成 ./src/other.js, 最终的源码大概就是 __webpack_require__('./src/other.js')
                    node.arguments = [t.stringLiteral(moduleName)]
                }
            }
        })
        
        // 将ast转成js源码
        let moduleCode =  generator(Ast).code

        return {
            moduleCode,
            dependencies
        }
    }
    // 发送文件，将组装好的文件写入磁盘
    emitFile() {
        let templateUrl = path.resolve(__dirname, 'template.ejs')
        let template = this.getSource(templateUrl)
        // ejs 渲染打包模板
        let code = ejs.render(template.toString(), {
           modules:  this.modules,
           entryId: this.entryId
        })
        // 根据配置文件出口，写入磁盘，
        let writePath = path.join(this.config.output.path,this.config.output.filename)
        fs.writeFileSync(writePath, code)
    }
}