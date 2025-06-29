const User = require("../Database/user");



module.exports.renderSignupForm =(req,res)=>{
    res.render("./user/user_signup_form.ejs");
}

module.exports.userSignupPost = async(req,res,next)=>{
    try{
    let {username,email,password}=req.body;
     let newUser = new User({email,username});
     let registeredUser =await User.register(newUser,password);
     
     req.login(registeredUser,(err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","Login successfull");
        res.redirect("/");
     })
    }
    catch(err){
        req.flash("error",err.message);
        res.redirect("/user/signup");
    }
}

module.exports.renderLoginForm = (req,res)=>{
    res.render("./user/user_login.ejs");
}

module.exports.loginPostRoute = async(req,res)=>{
    req.flash("success","LoginSuccess");
    
    let redirectedUrl = res.locals.redirectUrl||"/";
    res.redirect(redirectedUrl);
}