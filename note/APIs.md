# APIs



### XML and JSON

就是两种记录的格式，后者用的多一些，因为它形式上就是JavaScript去掉了一些修饰代码



### API的使用

首先要明白什么是API，它就是一种接口，可以让我们访问别人对外提供的数据，他提供什么我们才能访问什么，有些需要key才能访问



其次我们要安装**request**包，这个包用来发送请求

```js
var request = require("request");

request("https://jsonplaceholder.typicode.com/users", function(error, response, body){
	if(!error && response.statusCode == 200) {
		var parsedData = JSON.parse(body);
		console.log(parsedData[0]["name"]);
	}
});	
```

返回的就是body（如果没有出error的话），如果我们想通过访问JavaScript对象那样访问返回数据的话我们就要用`JSON.parse`去完成转换