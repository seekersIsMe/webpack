function promise2 (fn) {
    this.state = 'pending'; // 状态
    this.resolveBc = []; // resolve回调函数
    this.rejectBc = []; // reject回调函数
    fn(resolve, reject)
    function resolve(params) {
        if(this.state=== 'pending') {
            this.state === 'resolve'
        }
        this.state === 'resolve'
        setTimeout(() =>{
            this.resolveBc.forEach(p => p())
        },0)
    }
    function reject(params) {
        if(this.state=== 'pending') {
            this.state === 'reject'
        }
        this.state === 'reject'
        setTimeout(() =>{
            this.rejectBc.forEach(p => p())
        },0)
    }
}