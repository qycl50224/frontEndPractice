# Templates and EJS

EJS 全程 **embedded JavaScript**，是一种**npm**

理解为放在html中的JavaScript代码

传递变量的方法

```js

// pass a local variable to the view
res.render('love.ejs', { name: 'Tobi' } {
  // ...
})
```

下面是love.ejs中表示变量的形式，可以看到我们还可以对外部传递进来的变量进行形式上的改变，比如大小写

```ejs
<div>
    <p>
        i love <%= name.toUppercase() %>
    </p>
</div>
```

### 在ejs中写条件和循环语句

把这俩种语句用在ejs中可以起到怎样的作用呢？

一个不难想到的就是发帖，每发一个贴就要增加一个div或者li标签，用条件和循环语句就实现了增删贴的功能，解决了我之前关于写网站的疑惑，如果只用html，每多一个标签都得手动去更改，肯定是不现实的，一定有什么工具可以让这一切自动化。

ok下面看一下如何实现

具体方法就是在ejs中对循环和条件语句代码用和包装变量的方式包装起来，只不过不用赋值的等号

```ejs
<% for(var i = 1; i < 10; i++){ %>
   <li> <%= post[i].name %> </li> 
<% } %>
```

### 用public使代码布局更模块化

![image-20200326011214579](C:\Users\chen\AppData\Roaming\Typora\typora-user-images\image-20200326011214579.png)

把涉及到的页面也就是ejs文件和css文件全部放到public中

然后我们把工作环境切换到public文件夹下面

还可以省略ejs的后缀

```js
app.use(express.static("public"));
app.set("view engine", "ejs");
```



### 用partial解决header和footer

因为我们的子页面有很多个，如果每一个都去写他的header和footer，也就是body以外的东西很繁琐，可以想象一下每个页面都要写一遍link，因此，我们将使用partial

partial也就是在views文件夹中新建一个文件夹

![image-20200326005034811](C:\Users\chen\AppData\Roaming\Typora\typora-user-images\image-20200326005034811.png)

里面有header和footer的ejs文件

然后我们只需要在子页面上调用header和footer通过**include**方法

```ejs
<%- include partials/header %>
blablabla
<%- include partials/footer %>
```

下面是一个header例子

```ejs
<!DOCTYPE html>
<html>
  <head>
    <title>Demo App</title>
    <link rel="stylesheet" type="text/css" href="/app.css">
  </head>
  <body>
```



#### 一个小trick

在link css文件时候，我们本该把它的位置具体写出来比如

```
/style/app.css
```

但是实际上我们可以让他自己去找

也就是用一个splash

```
/app.css
```

