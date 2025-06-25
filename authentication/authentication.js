module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
       console.log("working");
        
        return res.redirect("/user/login");
    }
    console.log("it also worked");
    next();
}