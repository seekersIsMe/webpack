## 事件流，订阅发布模式
## tapable

### loader 执行顺序
1. 从下往上，从右往左
2. 给定enforce参数： pre > normal > inline(行内loader,将loader嵌入到我们的业务代码中，例如： require('test-loader!a.js'); 这句就表示引入a.js用test-loader处理) > post 

 *  行内loader的用法:
  1. -! 禁用前置和正常loader处理， 例如`require('-!test-loader!a.js');`
  2. !  禁用普通正常loader处理
  3. !! 除了当前的loader,其他的loader都不处理， 也就是禁用前置、普通、后置loader
* loader有两部分组成，分为pitch和normal，先执行pitch，其顺序是从左到右，如果pitch如果有返回值，则会直接跳过自己以及后面的的loader执行
 
 **这里后面会加图片**

###  sourcemap的原理
https://cloud.tencent.com/developer/article/1598223
