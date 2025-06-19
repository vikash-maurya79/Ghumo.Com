const express = require("express");
const app = express();
const path = require("path");
const ejsmate = require("ejs-mate");
const mongoose = require("mongoose");
const product_data = require("./Database/product");
const methodoverride = require("method-override");
const { listingSchema, reviewSchema } = require("./schema_validation.js");
const product = require("./router/listing.js");
const review = require("./router/review.js");
app.use(methodoverride("_method"));
app.use(express.static("public"));
app.engine("ejs", ejsmate);
app.set("views", path.join(__dirname, "/views"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
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

app.get("/", asyncWrap(async (req, res, next) => {
    const data = await product_data.find({});
    console.log("it's working");
    res.render("./listings/home.ejs", { data });
    console.log("render is not working");
    console.log("Home route is running well");
    console.log("Data is ", data);
}
)
)

app.use("/product",(product));
app.use("/product/review",(review));
 

function asyncWrap(fn) {
    return function (req, res, next) {
        fn(req, res, next).catch((err) => {
            next(err);
        })
    }
}
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