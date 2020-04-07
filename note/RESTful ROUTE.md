# RESTful ROUTE



在构建网页前写Routing

## RESTful ROUTING



| name   | url        | verb | desc                            |
| ------ | ---------- | ---- | ------------------------------- |
| INDEX  | /dogs      | GET  | display a list of all dog       |
| NEW    | /dogs/new  | GET  | displays form to make a new dog |
| CREATE | /dogs      | POST | add new dog to DB               |
| SHOW   | /dogs/:id: | GET  | shows info about one dog        |



### render and redirect

```js
res.render(file, func)
res.redirect()
```

The steps will then look like this:

1. User goes to `/login`.
2. User submits login data with form POST.
3. Server validates data and establishes login session.
4. Server does `res.redirect('/home')` (or whatever URL you want here) to tell the browser to go to the new URL.
5. Browser processes the redirect and sends request for that new page.
6. Server sees request for the new page and uses `res.render()` to render the data for that page.
7. Browser displays rendered page on the new URL.

简单地说，`render`导向某个**ejs**，而`redirect`先导向一个地址再导向**ejs**

### 一种特殊的name写法



```ejs
	<img src="..." name="blog[image]">
	<p ... name="blog[title]"></p>
```

这样我们在导入数据库的时候可以直接

```js
var newBlog = req.body.blog
```



### method-override 包使用

使用原因：这个需求主要来自前端的form。比如我们在后端提供一个针对HTTP PUT的API， 前端的数据提交时，我们自然希望FORM能够产生一个PUT请求。然而，**浏览器的FORM只能GET或者POST**。怎么办？ 改变后端的API吗？如果这个API是别的服务商提供，我们无权更改呢？这时，我们就需要method-override来帮助我们。
浏览器会自动把PUT转换为GET请求

使用方法：

```js
var methodOverride = require("method-override");
app.use(methodOverride("_method"))
```

页面上也要更改，注意方法必须是**POST**

```ejs
<form class="ui form" action="/blogs/<%= blog._id %>?_method=PUT" method="POST">
```

### express-sanitizer 包使用

使用原因：如果



使用效果：

The string

```
'<script>hello</script> world'
```

will be sanitized to ' world'.