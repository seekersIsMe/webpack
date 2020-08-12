// const loaderUtil = require('loader-utils')
function testLoader (source) {
    // source = `try {${source}} catch (error) {console.log(error)}`
    console.log('源码', this.sourceMap)
    return source
}
module.exports = testLoader