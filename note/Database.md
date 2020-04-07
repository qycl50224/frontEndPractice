# Database

一个关于mongoDB的nodejs包 **mongoose**，

首先要会用goorm创建一个mongodb，然后是怎么访问mongodb，先用第一个terminal输入`mongod`，再用第二个terminal输入`mongo`

进入后可以有以下操作

- `show dbs`
- `use cat_app`
- `show collections`
- `db.cats.find()`
- `db.cats.drop()`也就是清空

![image-20200331011800365](C:\Users\chen\AppData\Roaming\Typora\typora-user-images\image-20200331011800365.png)







这节其实就是讲了mongoose的使用把

使用方法

```js
var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/cat_app");

var catSchema = new mongoose.Schema({
   name: String,
   age: Number,
   temperament: String
});

var Cat = mongoose.model("Cat", catSchema);

//adding a new cat to the DB

// var george = new Cat({
//     name: "Mrs. Norris",
//     age: 7,
//     temperament: "Evil"
// });

// george.save(function(err, cat){
//     if(err){
//         console.log("SOMETHING WENT WRONG!")
//     } else {
//         console.log("WE JUST SAVED A CAT TO THE DB:")
//         console.log(cat);
//     }
// });

Cat.create({
   name: "Snow White",
   age: 15,
   temperament: "Bland"
}, function(err, cat){
    if(err){
        console.log(err);
    } else {
        console.log(cat);
    }
});

//retrieve all cats from the DB and console.log each one

Cat.find({}, function(err, cats){
    if(err){
        console.log("OH NO, ERROR!");
        console.log(err);
    } else {
        console.log("ALL THE CATS.....");
        console.log(cats);
    }
});

Cat.findById
Cat.findByIdAndUpdate
```



