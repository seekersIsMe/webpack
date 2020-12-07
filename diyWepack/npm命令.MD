1. 告诉系统用什么来运行代码, 在文件顶部写上以下代码,用node运行改代码  
```
#!/usr/bin/env node
```

2. 在package.json中写bin的命令,并要执行的代码路径
```
  "bin": {
    "diyWepack": "./bin/diywebpack.js"
  },
```

3. 要将当前的package.json link到全局,所以在当前package.json的目录下执行`npm link`