#!/usr/bin/env node

console.log('ok')

// 1).先拿到config
const path = require('path')
const config = require(path.resolve('webpack.config.js')) 
const Compiler = require('./Compiler.js')
const compiler = new Compiler(config)
compiler.run()