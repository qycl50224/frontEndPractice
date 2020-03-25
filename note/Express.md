# Express

express 是nodejs的一个库，用来写网络应用

nodejs的导入包的方法比较特别

```js
	var express = require("express");
	var app = express();
```



有点像是把一个包实例化

然后是用`express`的`get`和`post`方法，

了解`res`的`send`方法我们可以给web添加子页面

最后要有一个`listen`方法，输入参数为**port：3000**，

```js
app.get("/dog", (req, res) =>{
	console.log("Some one made a request !");
    // 一次只能有一次send
	res.send("Here are some dogs!!!");
})

app.post("/dog", (req, res) =>{
	res.send("its a post method!");
	console.log("someone made a post");
})

app.listen(process.env.PORT || 3000, process.env.IP, function(){
	console.log("Server has started!!!");
});
```

这里用的是云上服务器goorm

用`npm init` 来创建`package.json`

用`nodemon`包来自动更新服务器，不用每次中断再刷新了，很方便



## Route Paras

- Show the `*` route matcher
- Write routes containing route parameters
- Discuss route order

假如请求的地址不存在，就会进入`*`下面，星号表示可以替代任意表示，但是只有在请求地址不存在的前提下才考虑星号，这里有一个先后次序要注意

用冒号来标识这是一个可任意取的参数`/c/:whatever`

除此之外，要弄明白`req`里面都有什么，我们在冒号后面的输入的参数都会保存到`req`中，并且可以通过`dot notation` 来访问，比如`req.params.word`，word是一个任意输入



