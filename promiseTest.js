function Promise2 (fn) {
    this.state = 'pending'; // 状态
    this.resolveBc = []; // resolve回调函数
    this.rejectBc = []; // reject回调函数
    this.data = ''
    fn(resolve.bind(this), reject.bind(this))
    function resolve(value) {
        if(this.state=== 'pending') {
            this.state === 'resolve'
        }
        this.state === 'resolve'
        this.data = value
        setTimeout(() =>{
            this.resolveBc.forEach(p => p(value))
        },0)
    }
    function reject(value) {
        if(this.state=== 'pending') {
            this.state === 'reject'
        }
        this.state === 'reject'
        this.data = value
        setTimeout(() =>{
            this.rejectBc.forEach(p => p(value))
        },0)
    }
}

Promise2.prototype.then = function (onResolve, onReject) {
    onResolve = typeof onResolve === 'function' ? onResolve:  v => v
    onReject = typeof onReject === 'function' ? onReject: v =>  {throw v}
    let promise2;
    if(this.state=== 'pending') {
        return promise2 = new Promise2((resolve, reject) =>{
            this.resolveBc.push(function(value) {
                try {
                    let resolut =  onResolve(value) // 当前上一个promise的then回调的返回值
                    resolvePromise2(promise2, resolut, resolve, reject)
                } catch (error) {
                    reject(error)
                }
            })
            this.rejectBc.push(function(value) {
                try {
                    let resolut =  onReject(value) // 当前上一个promise的then回调的返回值
                    resolvePromise2(promise2, resolut, resolve, reject)
                } catch (error) {
                    reject(error)
                }
            })
        })
    }
    if(this.state=== 'resolve'){
        return promise2 = new Promise2((resolve, reject) =>{
           setTimeout(function() {
                try {
                    let resolut =  onResolve(value) // 当前上一个promise的then回调的返回值
                    resolvePromise2(promise2, resolut, resolve, reject)
                } catch (error) {
                    reject(error)
                }
           })
        })
    }

    if(this.state=== 'reject'){
        return promise2 = new Promise2((resolve, reject) =>{
           setTimeout(function() {
                try {
                    let resolut =  onReject(value) // 当前上一个promise的then回调的返回值
                    resolvePromise2(promise2, resolut, resolve, reject)
                } catch (error) {
                    reject(error)
                }
           })
        })
    }
}

Promise2.prototype.catch =  onRejected => {
    // catch 方法就是then方法没有成功的简写
    return this.then(null, onRejected);
}

Promise2.all = function(promises){
    return new Promise2((resolve,reject) =>{
        if(Array.isArray(promises)) {
            let i = 0 
            let resAry = []
            for(let k=0; k<promises.length; k++) {
                promises[k].then((res) =>{
                    resAry.push(res)
                    i++
                    if(i===promises.length) {
                        resolve(resAry) 
                    }
                })
            }
        } else{
            reject()
        }
    })
}

Promise2.resolve =  () => new Promise2((resolve,reject) =>resolve())
Promise2.reject = () => new Promise2((resolve,reject) =>reject())


function resolvePromise2(promise2, resolut, resolve, reject) {
    let called = false // 避免多次调用
    if(promise2 === resolut) {
        // 避免promise循环调用
        return reject(new TypeError('Chaining cycle detected for promise'))
    }
    
    let type = typeof resolut
    if(resolut!==null && (type === 'object' || type === 'function')){
        try {
            let then = resolut.then
            if(typeof then === ' function') {
                then.call(resolut, function (res) {
                    if(called) return
                    called= true
                    let re = resolvePromise2(promise2, res, resolve, reject)
                    return re
                },function (res) {
                    if(called) return
                    called= true
                    reject(res)
                })
            } else {
                resolve(resolut)
            }
        } catch (error) {
            reject(error)
        }
        
    } else {
        resolve(resolut)
    }
}
Promise2.all([new Promise2((resolve,reject) =>{
    resolve(1)
}), new Promise2((resolve,reject) =>{
    resolve(2)
}),new Promise2((resolve,reject) =>{
    resolve(3)
})]).then(res =>{
    console.log(res)
})
// new Promise2(function(resolve, reject) {
//     reject(10)
// }).then(res =>{
//     console.log(res)
// }, err =>{
//     console.log('拒绝',err)
// })
// new Promise2(resolve=>{
//     resolve();
// }).then(()=>{
//     console.log('out 1');
// }).then(()=>{
//     console.log('out 2');
// }).then(()=>{
//     console.log('out 3');
// }).then(()=>{
//     console.log('out 4');
// }).then(()=>{
//     console.log('out 5');
// }).then(()=>{
//     console.log('out 6');
// });
// new Promise2(resolve=>{
//     resolve();
// }).then(()=>{
//     console.log('inner 1');
// }).then(()=>{
//     console.log('inner 2');
// }).then(()=>{
//     console.log('inner 3');
// }).then(()=>{
//     console.log('inner 4');
// }).then(()=>{
//     console.log('inner 5');
// }).then(()=>{
//     console.log('inner 6');
// });