// https://github.com/michael-ciniawsky/postcss-load-config

module.exports = {
  "plugins": {
    // "postcss-import": {},
    "autoprefixer": {
      /**
       * 参考知识
       * https://github.com/browserslist/browserslist
       * http://www.somegeekintn.com/blog/stuff/iosvers/
       */
      "browsers":[
        "iOS >= 6",
        "Android >= 4",
        "ie >= 9"
      ]
    }
  }
}
