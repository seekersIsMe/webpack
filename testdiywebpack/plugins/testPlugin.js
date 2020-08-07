class testPlugin {
    apply (compiler) {
        // 订阅
        compiler.hooks.beforeEntry.tap('beforeEntry', () =>{
            console.log('配置文件传入')
        })
    }
}
module.exports = testPlugin