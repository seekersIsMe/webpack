function Promise2(resolver) {
    var self = this //保存this
    self.callbacks = [] //保存onResolve和onReject函数集合
    self.status = 'pending' //当前状态
    this.id = '啊哈哈哈' + Math.random() * 10
    function resolve(value) {
        setTimeout(function() { //异步调用
            console.log('缓存数组1',self.callbacks)
            if(self.status !== 'pending') {
                return
            }
            self.status = 'resolved' //修改状态
            self.data = value
            for(var i = 0; i < self.callbacks.length; i++) {
                self.callbacks[i].onResolved(value)
            }
        }, 1000)
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
        }, 1000)
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
        console.log('缓存数组',self.callbacks)
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

new Promise2(resolve=>{
    resolve();
}).then(()=>{
    console.log('out 1');
}).then(()=>{
    console.log('out 2');
}).then(()=>{
    console.log('out 3');
}).then(()=>{
    console.log('out 4');
}).then(()=>{
    console.log('out 5');
}).then(()=>{
    console.log('out 6');
});
new Promise2(resolve=>{
    resolve();
}).then(()=>{
    console.log('inner 1');
}).then(()=>{
    console.log('inner 2');
}).then(()=>{
    console.log('inner 3');
}).then(()=>{
    console.log('inner 4');
}).then(()=>{
    console.log('inner 5');
}).then(()=>{
    console.log('inner 6');
});