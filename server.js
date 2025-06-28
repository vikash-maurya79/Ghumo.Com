const express = require("express");
const app = express();
const path = require("path");
const cookieparser = require("cookie-parser");
app.use(cookieparser("secretcode"));
const ejsmate = require("ejs-mate");
const mongoose = require("mongoose");
const product_data = require("./Database/product");
const methodoverride = require("method-override");

app.use(methodoverride("_method"));
app.use(express.static("public"));
app.engine("ejs", ejsmate);
app.set("views", path.join(__dirname, "/views"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const session = require("express-session");
const flash = require("connect-flash");
const User = require("./Database/user.js");
const passport = require("passport");
const localStrategy = require("passport-local").Strategy;




app.use(session({
    secret: "mysecretecode",
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true
    }
}
));


const productRouter = require("./router/listing.js");
const reviewRouter = require("./router/review.js");
const userRouter = require("./router/user.js");
const homeRouter = require("./router/home.js");


app.use(flash());
main().then(() => {
    console.log("Database is working well");

})
async function main() {
    try {
        await mongoose.connect("mongodb://127.0.0.1:27017/Ghumo_Product")
    }
    catch (err) {
        console.log("Error occured ");
    }
}
app.use(passport.initialize());
app.use(passport.session());

passport.use(User.createStrategy());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currentUser = req.user;
    next();
});
app.use(passport.initialize());
app.use(passport.session());

passport.use(User.createStrategy());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use("/product", (productRouter));
app.use("/product/review", (reviewRouter));
app.use("/user", (userRouter));
app.use("/",(homeRouter));


app.get("/logout",(req,res,next)=>{
        req.logOut((err)=>{
            if(err){
                next(err);
            }
            req.flash("success","Loged Out");
            res.redirect("/");
        })
}) 






app.use((err, req, res, next) => {
    let status = err.status || 500;
    let message = err.message || "Somthing went wrong";
    res.status(status).send(message);
})
//................Middleware to handle unknown route access.........//
app.all("*", (req, res, next) => {
    let data = "This page is lost in space , stop searching and back to earth !!";
    res.render("./listings/error.ejs", { data });
})
app.listen("8888", () => {
    console.log("Server is running successfully at port 8888");
})