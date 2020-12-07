> 参考 https://zhuanlan.zhihu.com/p/58428287
1. resolve是执行resolve状态的回调函数,用一个数组进行存储,可以借鉴观察者模式
    * resolve是需要异步执行,保证在then注册完所有的状态回调函数之后执行,使用定时器
2. reject 是执行reject状态的回调函数
3. then方法:
    * 通过传参的形式,进行resolve和reject状态的回调函数的注册,也就是push到相应的存储数组中,**所以链式调用的then方法是同步的向数组中push回调函数**
    * 链式调用, 返回一个Promise对象
4. 后邻promise的状态由当前promise的then方法的形参中的成功回调函数的返回值决定

