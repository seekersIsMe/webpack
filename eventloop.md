
> 本文之所以叫宏任务、宏任务队列、微任务队列、微任务，只是将两者区分开来 
### 事件循环
> 三个概念
* 调用栈，先进后出
* 宏任务队列（存放宏任务的，队列先进先出）
* 微任务队列
#### 异步任务又分为宏任务和微任务
> 宏任务，macrotask，也叫tasks
* setTimeout
* setInterval
* setImmediate (Node独有)
* requestAnimationFrame (浏览器独有)
* I/O
* DOM/Web events (onclick, onkeydown, XMLHttpRequest etc)
* UI rendering (浏览器独有)

> 微任务，microtask，也叫jobs
* process.nextTick (Node独有)
* Promise
* Object.observe
* MutationObserver

#### 事件循环执行的过程
**一轮事件循环只取一个宏任务，宏任务中的同步代码执行完后，就依次从前往后执行微任务队列中的微任务**

1. 代码执行初期，调用栈为空，宏任务队列中只有script这个宏任务，微任务队列为空
2. 将script这个宏任务放入调用栈中，执行同步代码
3. 遇到微任务，就将微任务加到微任务队列中，遇到宏任务，就将宏任务加到宏任务队列中，遇到函数调用的，就将该函数加到调用栈中，执行该函数中的同步代码，遇到微任务或者是宏任务，就将它们加到对应的任务队列中
4. 等调用栈中的同步代码执行完成后，查看微任务队列中是否有微任务，有则从微任务队列头部开始逐一执行微任务中的同步代码，如果该微任务中有宏任务，则将宏任务加到宏任务队列的末尾，如果微任务中微任务，则将微任务加到微任务队列尾部中，并在此次事件循环中执行完
5. 微任务队列中的任务都执行完后，继续下一轮事件循环，从宏任务头部取出第一个任务，执行同步代码，之后重复3和4步

###### 下面见一个例子：
```
    function a () {
        console.log(1)
        let macrotask1 =  setTimeout(() =>{ 
            console.log(2)
            let microtask4 = new Promise((resolve,reject) =>{
                console.log(11)
                resolve()
            }).then(res =>{
                console.log(12)
            })
            console.log(13)
        }, 0)
        let microtask1 = new Promise((resolve,reject) =>{
            console.log(3)
            resolve()
        }).then(res =>{
            console.log(4)
             let microtask3 = new Promise((resolve,reject) =>{
                console.log(14)
                resolve()
            }).then(res =>{
                console.log(15)
            })
            console.log(16)
        })
        b()
        console.log(9)
    }
    function b (){
        console.log(5)
        let macrotask2 = setTimeout(() =>{
            console.log(6)
        }, 0)
        let microtask2 = new Promise((resolve,reject) =>{
            console.log(7)
            resolve()
        }).then(res =>{
            console.log(8)
        })
    }
    a()
    console.log(10)

//  1 3 5 7 9 10 4 14 16 8 15 2 11 13 12 6
// 
```
 为了更好说明，microtask表示代码中微任务，macrotask表示宏任务

1. 将script宏任务放入调用栈，执行同步代码，所以先打印1
2. 接着遇到macrotask1（setTimeout,因为是0秒，所以立马加入到宏任务队列中）第一个宏任务，将其加入宏任务队列的尾部
3. 接着遇到microtask1（promise）第一个微任务，new Promise在实例的过程中执行代码都是同步进行的，只有回调then()才是微任务，所以打印3，并将then加到了微任务队列中
4. 接着遇到调用b函数，所以先打印了5
5. 接着遇到macrotask2（setTimeout）第二个宏任务，将其加到红任务队列的尾部
6. 接着遇到microtask2（promise）第二个微任务，实例化执行同步代码，打印7，并将then中打印8的代码加到微任务队列的尾部
7. 至此b函数同步代码执行完成，接着执行a函数中最后的同步代码，打印9
8. 至此a函数同步代码执行完成，
9. 接着执行script最后的同步代码，打印10
10. 至此第一轮事件循环的同步代码执行完成
11. 此时微任务队列中有microtask1和microtask2两个微任务，微任务队列依次从前往后执行微任务
12. 执行第一个microtask1微任务，打印4
13. 接着又遇到了第三个微任务，执行实例化同步代码，打印14，并将then中打印15的代码加到微任务队列的尾部，此时微任务队列中有三个微任务
14. 接着执行同步代码console.log(16)，打印16，至此第一个微任务执行完成，从微任务队列中删除
15. 接着执行第二个microtask2微任务，打印8，至此第二个微任务执行完成，从微任务队列中删除
16. 接着执行第三个microtask3微任务，打印15，至此第二个微任务执行完成，从微任务队列中删除
17. 此时微任务队列已经为空，第一轮事件循环执行完成，并从宏任务队列中删除
18. 接着执行下一轮事件循环，取出第一个宏任务，并执行同步代码，打印2
19. 接着遇到microtask4（promise）第四个微任务，实例化执行同步代码，打印11，并将then中打印12的代码加到微任务队列中，此时微任务队列只有这个微任务
20. 接着执行macrotask1宏任务中最后的同步代码，打印13
21. 接着查看微任务队列，发现有一个微任务microtask4
22. 接着执行微任务microtask4，打印12，至此该微任务执行完成，并从微任务队列中删除，此时微任务队列为空，至此第二轮事件循环执行完成，并从宏任务队列中删除
23. 接着执行下一轮事件循环，从宏任务队列取出第一个宏任务，也就是macrotask2，执行该宏任务中同步代码，打印6

#### dom事件回调函数是宏任务，那么见下代码：
```
console.log(1);
new Promise((resolve, reject) => {
resolve(3)
}).then(() => {
console.log(2);
})
var button = document.querySelector(".button");
button.addEventListener('click', () => { console.log(3); })
button.click()
// 1 3 2
```
按照上面说的执行规则，按理说打印顺序是 123，但运行的结果是1 3 2，那么问题出在哪里呢，那是因为人工合成（synthetic）的事件派发（dispatch）是同步执行的，包括执行click()和dispatchEvent()这两种方式。直接 domEle.click() 和 真的在页面上点击然后触发事件回调应该是不一样的。所以上面的代码执行顺序就像下面的：
```
console.log(1);
new Promise((resolve, reject) => {
resolve(3)
}).then(() => {
console.log(2);
})
console.log(3)
```




#### vue.nextTick的原理
* Vue nextTick其实就是将dom更新后的操作当成微任务加到dom更新微任务的后面，保证其执行的顺序，再不行就使用setTimeout宏任务代替，在下一轮事件循环中执行，这也是为什么Promise，MutationObserver的优先级比setTimeout高


参考文章：[第一篇](https://www.zeolearn.com/magazine/javascript-how-is-callback-execution-strategy-for-promises-different-than-dom-events-callback)