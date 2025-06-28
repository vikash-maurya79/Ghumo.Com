const express = require("express");
const router = express.Router();
const User = require("../Database/user");
const passport= require("passport");
const {saveredirectUrl} = require("../authentication/authentication.js");


router.get("/signup",async (req,res)=>{
    res.render("./user/user_signup_form.ejs");
})

router.post("/signup",async(req,res,next)=>{
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
})
router.get("/login",(req,res)=>{
    res.render("./user/user_login.ejs");
})
router.post("/login",saveredirectUrl,passport.authenticate("local",{failureRedirect:"/login",failureFlash:true}),async(req,res)=>{
    req.flash("success","LoginSuccess");
    
    let redirectedUrl = res.locals.redirectUrl||"/";
    res.redirect(redirectedUrl);
})


function asyncWrap(fn) {
    return function (req, res, next) {
        fn(req, res, next).catch((err) => {
            next(err);
        })
    }
}

module.exports=router;