// const {SyncHook, SyncBailHook,SyncWaterfallHook,SyncLoopHook,AsyncParallelHook, AsyncSeriesHook, AsyncParallelBailHook, AsyncSeriesWaterfallHook} = require('tapable')

// SyncHook 同步的钩子
// SyncBailHook 同步的保险钩子，函数返回值不是undefinde就停止执行下面的钩子
// SyncWaterfallHook 瀑布钩子，上一个钩子函数return的值会传到下一个钩子函数的回调函数中
// SyncLoopHook 循环执行钩子，遇到某个不返回undefined的监听函数就会循环执行

// AsyncParallelHook 异步并行钩子
// AsyncSeriesHook 异步串行钩子
// AsyncParallelBailHook  // 异步并行 保险钩子
// AsyncSeriesWaterfallHook  // 异步串行瀑布钩子

// tapable库有三种注册方法，tap同步注册，tapAsync(cd) 异步注册， tapPromise(注册的是Promise)

// 调用的时候也是对应有三种，call、callAsync、promise

// 同步钩子
const SyncHook = require('./SyncHook')
let synhook = new SyncHook()
synhook.tap('test', ()=>{
    console.log('执行钩子函数')
})
function test () {
    console.log('初始化')
    synhook.call()
    console.log('挂载')
    console.log('更新数据')
}
test()
// 节流函数
function throttle (fn, delay) {
    let timer = null
    let flag = true
    return function (...args) {
        let context = this
        if(!flag) return
        flag = false
        if(timer) clearTimeout(timer)
        timer = setTimeout(() =>{
            fn.apply(this, args)
            flag = true
        }, delay)
    }
}
// 防抖函数
function debounce (fn, delay){
    let timer = null
    return function (...args) {
        if(timer) clearTimeout(timer)
        let context = this
        timer = setTimeout(() =>{
            fn.apply(this, args)
            flag = ture
        }, delay)
    }
}
