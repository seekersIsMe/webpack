const fs = require('fs')
const path = require('path')
const acorn = require('acorn')
const traverse = require('@babel/traverse').default
const t = require('@babel/types')
const generator = require('@babel/generator').default
module.exports = class Compiler {
    constructor (config) {
        this.config = config
        this.entryId = config.entry
        this.modules = {}
        this.root = process.cwd() //process.cwd() 方法会返回 Node.js 进程的当前工作目录, 
        // C:\Users\admin\Desktop\webpack0.1\testdiywebpack
    }
    run () {
        console.log('配置', this.root)
        // 传入入口文件的绝对路径
        this.buildModule(path.resolve(this.root, this.entryId), true)
    }
    // 构建模块
    /*
    * url绝对路径
    * isEntry是否是入口文件
    */
    buildModule(url, isEntry) {
        // 同步获取源码
        let soucerCode = fs.readFileSync(url)
        console.log(soucerCode.toString())
        // 获取源码的相对根目录的相对路径, 例如用'./src/index.js' 作为index.js模块的key值
        let moduleName = './' + path.relative(this.root, url)
        console.log('路劲', moduleName)
        //  path.dirname(moduleName) 获取父路径 
        let {moduleCode, dependencies} = this.parse(soucerCode, path.dirname(moduleName))
        this.modules[moduleName] = moduleCode
        if(!isEntry) {
            dependencies.forEach(p =>{
                this.buildModule(path.join(this.root, p), false)
            })
        }
    }
    /**
     * 解析源码 AST解析语法树
     * soucerCode 源码
     * parentPath 附路径
     * 
     * * 使用的库有：
     * 1. acorn 将代码转成AST语法树
     * 2. @babel/traverse遍历节点
     * 3. @babel/types 节点替换，将require替换成__webpack_require__（webpack自己写得一个require方法）
     * 4. @babel/generator 将替换好的AST语法树转成代码字符串
     */
    /// https://astexplorer.net/
    parse (soucerCode, parentPath) {
        let Ast = acorn.parse(soucerCode)
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
                    moduleName = './' + path.join(parentPath, moduleName) // ./src/other.js
                    dependencies.push(moduleName)
                    // 将源码中依赖改成 ./src/other.js, 最终的源码大概就是 __webpack_require__('./src/other.js')
                    node.arguments = [t.stringLiteral(moduleName)]
                }
            }
        })
        
        // 将ast转成js源码
        let moduleCode =  generator(Ast).code

        console.log('Ast', JSON.stringify(Ast))
        return {
            moduleCode,
            dependencies
        }
    }
}