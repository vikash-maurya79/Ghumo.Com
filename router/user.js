const express = require("express");
const router = express.Router();
const User = require("../Database/user");
const passport= require("passport");

router.get("/signup",async (req,res)=>{
    res.render("./user/user_signup_form.ejs");
})

router.post("/signup",async(req,res,next)=>{
    try{
    let {username,email,password}=req.body;
     let newUser = new User({email,username});
     let registeredUser =await User.register(newUser,password);
     console.log("Registered user is",registeredUser);
     req.flash("success","Welcome to Ghumo.Com");
     res.redirect("/");
    }
    catch(err){
        req.flash("error",err.message);
        res.redirect("/user/signup");
    }
})
router.get("/login",(req,res)=>{
    res.render("./user/user_login.ejs");
})
router.post("/login",passport.authenticate("local",{failureRedirect:"/user/login",failureFlash:true}),async(req,res)=>{
    req.flash("success","Welcome back you are logedd in");
    res.redirect("/");
})

function asyncWrap(fn) {
    return function (req, res, next) {
        fn(req, res, next).catch((err) => {
            next(err);
        })
    }
}

module.exports=router;