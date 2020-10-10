class SyncHook {
    constructor () {
        this.list = []
    }
    call() {
        let i = 0
        let len = this.list.length
       while (i < len){
            this.list[i]()
            i++
        }
    }
    tap(...arg) {
        this.list.push(arg.slice(-1)[0])
    }
}
module.exports = SyncHook