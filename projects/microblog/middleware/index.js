var middlewareObj = {};


// 中间件
// 确认未登入,已登入不能登录及注册
middlewareObj.checkNotLogin = function checkNotLogin(req,res,next){
    if(req.session.user){
        req.flash('error','已登入');
        res.redirect('/');
    }else{
        next();
    }
}

// 确认已登入,未登入不能登出,并且转向登录页面
middlewareObj.checkLogin = function checkLogin(req,res,next){
    if(req.session.user){
        next();
    }else{
        req.flash('error','未登入');
        res.redirect('/login');
    }
}

module.exports = middlewareObj;