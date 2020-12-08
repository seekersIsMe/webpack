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
    
}