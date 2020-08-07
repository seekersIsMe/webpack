module.exports = function styleLoader (css) {
    let js = `
            var style = document.createElement('style') 
            style.innerText = ${JSON.stringify(css)}
            document.head.appendChild(style)` 
    return js
}