function Promise2(resolver) {
    var self = this //保存this
    self.callbacks = [] //保存onResolve和onReject函数集合
    self.status = 'pending' //当前状态
    function resolve(value) {
        setTimeout(function() { //异步调用
            if(self.status !== 'pending') {
                return
            }
            self.status = 'resolved' //修改状态
            self.data = value
            for(var i = 0; i < self.callbacks.length; i++) {
                self.callbacks[i].onResolved(value)
            }
        })
    }
    function reject(reason) {
        setTimeout(function() { //异步调用
            if(self.status !== 'pending') {
                return
            }
            self.status = 'rejected' //修改状态
            self.data = reason
            for(var i = 0; i < self.callbacks.length; i++) {
                self.callbacks[i].onRejected(reason)
            }
        })
    }
    try {
        resolver(resolve, reject) //执行resolver函数
    } catch(e) {
        reject(e)
        
    }
}
Promise2.prototype.then = function(onResolved, onRejected) {
    //健壮性处理，处理点击穿透
    onResolved = typeof onResolved === 'function' ? onResolved : function(v) {
        return v
        }
    onRejected = typeof onRejected === 'function' ? onRejected : function(r) {
         throw r
    }
    var self = this
    var promise2
    //promise状态为resolved
    if(self.status === 'resolved') {
        return promise2 = new Promise2(function(resolve, reject) {
            setTimeout(function() {
                try {
                     //调用then方法的onResolved回调
                    var x = onResolved(self.data)
                    console.log(x)
                    //根据x的值修改promise2的状态
                    resolvePromise2(promise2, x, resolve, reject)
                } catch(e) {
                 //promise2状态变为rejected
                    return reject(e)
                }
            })
        })
    }
    //promise状态为rejected
    if(self.status === 'rejected') {
        return promise2 = new Promise2(function(resolve, reject) {
            setTimeout(function() {
                try {
                    //调用then方法的onReject回调
                    var x = onRejected(self.data)
                    //根据x的值修改promise2的状态
                    resolvePromise2(promise2, x, resolve, reject)
                } catch(e) {
                 //promise2状态变为rejected
                    return reject(e)
                }
            })
        })
    }
    //promise状态为pending
    //需要等待promise的状态改变
    if(self.status === 'pending') {
        return promise2 = new Promise2(function(resolve, reject) {
            self.callbacks.push({
                onResolved: function(value) {
                    try {
                        //调用then方法的onResolved回调
                        var x = onResolved(value)
                        //根据x的值修改promise2的状态
                        resolvePromise2(promise2, x, resolve, reject)
                     } catch(e) {
                        //promise2状态变为rejected
                        return reject(e)
                    }
                },
                onRejected: function(reason) {
                    try {
                        //调用then方法的onResolved回调
                        var x = onRejected(reason)
                        //根据x的值修改promise2的状态
                        // resolvePromise2(promise2, x, resolve, reject)
                        resolvePromise2(promise2, x, resolve, reject)
                    } catch(e) {
                        //promise2状态变为rejected
                        return reject(e)
                    }
                }
            })
        })
    }
}
function resolvePromise2(promise, x, resolve, reject) {
    var then
    var thenCalledOrThrow = false
    if(promise === x) {
        return reject(new TypeError('Chaining cycle detected for promise!'))
    }
    // 如果返回值是带有then属性的对象或者函数，则递归执行其then方法，当前的then返回的新promise的状态由这个返回值的状态决定，
    // 这里是怎么做的呢，就是将这个新promise的resolve和reject一直递归传下去，这样就可以在递归中控制当前then返回的新promise的状态
    // 如果是null或者非函数非对象则直接将这个新的promise状态改为成功，
    if((x !== null) && ((typeof x === 'object') || (typeof x === 'function'))) {
        try {
            then = x.then
            if(typeof then === 'function') {
                then.call(x, function rs(y) {
                if(thenCalledOrThrow) return
                    thenCalledOrThrow = true
                    let kk=resolvePromise2(promise, y, resolve, reject);
                    return kk;
                }, function rj(r) {
                    if(thenCalledOrThrow) return
                    thenCalledOrThrow = true
                    return reject(r)
                })
            } else {
                return resolve(x)
            }
        } catch(e) {
                    if(thenCalledOrThrow) return
                    thenCalledOrThrow = true
                    return reject(e)
                }
    } else {
            return resolve(x)
    }
}

/// 并行promise，then交替执行，刚开始执行队列里面只有a1和b1的then回调函数，并且这么多then的执行都是同步创建新promise，状态都是pendding,当第一个promise的resolve执行，下一个promise的then的回调函数进入执行队列，此时a1的then回调函数在b1的then回调函数的前面，所以先执行
// a1的then执行完后，就改变a2的状态，也就是执行resolve2(),接着a2的then回调加到执行队列尾部，此时执行队列中有b1的then的回调和a2的then的回调，接着执行b1的then的回调，依次这样执行下去，所以最终看到的结果就是a和b这两个promise所引发的then执行是交替执行
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

// 如果then返回的是一个带有then方法的对象，那么下个promise的状态由这个then执行结果所决定，
// 其实就是then的两个参数函数的执行所决定，就是这两个函数来改变下个promise的状态并引起下个promise的then的两个函数参数的执行
new Promise2(resolve=>{
        resolve(1);
    }).then((res) =>{
        return {
            then(resolve, reject) {
                reject(20)
            }
        }
    }).then(res=>{
        // console.log(res)
    }, res=>{
        console.log(res)
    })