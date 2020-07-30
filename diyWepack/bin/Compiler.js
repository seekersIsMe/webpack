const fs = require('fs')
const path = require('path')
module.exports = class Compiler {
    constructor (config) {
        this.config = config
        this.entryId = config.entry
        this.modules = {}
        this.root = process.cwd()
    }
    run () {
        console.log('配置', this.config)
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
        // 获取源码的相对根目录的相对路径
        let relative = path.relative(this.root, url)
        // 
        let {modules} = this.parse(soucerCode, path.dirname(relative))
    }
    /**
     * 解析源码
     * soucerCode 源码
     * parentPath 附路径
     */
    parse (soucerCode, parentPath) {

    }
}