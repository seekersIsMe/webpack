export function throttle(fn, wait) {
    let timer = null
    return function (...arg) {
        let that = this
        if(!timer) {
            timer = setTimeout(function () {
                timer = clearTimeout(timer)
                fn.apply(that, arg)
            }, wait)
        }
    }
}
export function debounce(fn, wait) {
    let timer = null
    return function (...arg) {
        let that = this
        if(timer) {
            timer = clearTimeout(timer)
        }
        if(!timer) {
            timer = setTimeout(function () {
                fn.apply(that, arg)
            }, wait)
        }
    }
}

export function call ( ts, ...arg) {
    // git reset --soft HEAD~  撤销上次提交
    // git reset -q HEAD -- .  撤销所有暂存更改
    // ​git push origin HEAD --force  // 强推到远程
}
// 深拷贝
// http
// promise