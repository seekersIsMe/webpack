Function.prototype.bind2 =function (...arg){
    let mark = arg[0]
    let that = this
    let params = arg.slice(1)
    return function () {
        return that.apply(mark, params)  
    }
}
function testBind (...params) {
    console.log(this.name)
    console.log('参数', params)
}
let foo =  testBind.bind2({name: 'zh'},1,2,3)
foo()