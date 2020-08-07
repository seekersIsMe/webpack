const less = require('less')

function lessLoader (content) {
    let css = ''
    less.render(content.toString(), (e, res) => {
        css = res.css
    })
    // body {\n  background: red;\n}\n  \n的话，js会认为是转义，所以要将\n替换成\\n
    css = css.replace(/\n/g, '\\n') 
    return css
}
module.exports = lessLoader