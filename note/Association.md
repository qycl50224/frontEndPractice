# Association

- Discuss one:one one:many many:many relationships
- Embedded many in one
- reference

### Embedded

举几个例子吧

一对一：我和我的名字，我和我的国籍，某本书和这本书的出版社。。。

一对多：我和我发表的帖子，我和我用过的手机。。。

多对多：每个人和她们发表的帖子。。。

显然，多对多的实现必须建立在数组的使用上面，

下面是关于如何实现记录我和我发表的帖子的代码

```js
var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/blog_demo");

// POST - title, content
var postSchema = new mongoose.Schema({
   title: String,
   content: String
});
var Post = mongoose.model("Post", postSchema);

// USER - email, name
var userSchema = new mongoose.Schema({
    email: String,
    name: String,
    // ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓
    posts: [postSchema]
});
var User = mongoose.model("User", userSchema);

// var newUser = new User({
//     email: "hermione@hogwarts.edu",
//     name: "Hermione Granger"
// });

// newUser.posts.push({
//     title: "How to bre polyjuice potion",
//     content: "Just kidding.  Go to potions class to learn it!"
// });

// newUser.save(function(err, user){
//   if(err){
//       console.log(err);
//   } else {
//       console.log(user);
//   }
// });

// var newPost = new Post({
//     title: "Reflections on Apples",
//     content: "They are delicious"
// });

// newPost.save(function(err, post){
//     if(err){
//         console.log(err);
//     } else {
//         console.log(post);
//     }
// });


User.findOne({name: "Hermione Granger"}, function(err, user){
    if(err){
        // console.log(err);
    } else {
        user.posts.push({
            title: "3 Things I really hate",
            content: "Voldemort.  Voldemort. Voldemort"
        });
        user.save(function(err, user){
            if(err){
                console.log(err);
            } else {
                console.log(user);
            }
        });
    }
});	
```



### Reference

一个比较好的讲解

https://blog.csdn.net/Elliott_Yoho/article/details/53537147

#### String Reference

我们把所有的post放在Post Model里面，所有的user放在User Model 里面

在`userSchema`中我们添加了一个`posts`，在后面就是这节讲的**reference**，把它与Post Model连接了起来，`ref`后面的**String**就是我们创建model的时候括号里的**String**，也就是*字符串关联*，

```js
var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/blog_demo_2");


var postSchema = new mongoose.Schema({
   title: String,
   content: String
});
var Post = mongoose.model("Post", postSchema);

// USER - email, name
var userSchema = new mongoose.Schema({
    email: String,
    name: String,
    // ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓
    posts: [
    	{
    		type: mongoose.Schema.Types.ObjectId,
            ref: "Post"
        }
    ]
});
var User = mongoose.model("User", userSchema);

// 这里创建post的时候，把post的_id放进了user的posts里面，所以之后才可以进行populate
Post.create({
  title: "How to cook the best burger pt. 4",
  content: "AKLSJDLAKSJD"
}, function(err, post){
    User.findOne({email: "bob@gmail.com"}, function(err, foundUser){
        if(err){
            console.log(err);
        } else {
            foundUser.posts.push(post);
            foundUser.save(function(err, data){
                if(err){
                    console.log(err);
                } else {
                    console.log(data);
                }
            });
        }
    });
});

// Find user
// find all posts for that user

// User.findOne({email: "bob@gmail.com"}).populate("posts").exec(function(err, user){
//     if(err){
//         console.log(err);
//     } else {
//         console.log(user);
//     }
// });


// User.create({
//     email: "bob@gmail.com",
//     name: "Bob Belcher"
// });
```





为了避免重复代码

我们可以把model分开写并放在models的文件夹里

```js
var Post = require("./models/post");
var User = require("./models/user");
```

但是这样做有个前提

我们要能从外部访问这些模块

所以在每个需要外部访问的js文件中，需要添加一个**暴露接口**的代码

`module.exports`

比如User Model

```js
module.exports = mongoose.model("User", userSchema);
```

