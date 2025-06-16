const express = require("express");
const app = express();
const path = require("path");
const ejsmate = require("ejs-mate");
const { urlencoded } = require("body-parser");
const mongoose = require("mongoose");
const { mainModule } = require("process");
const product_data = require("./Database/product")
const Review = require("./Database/review.js");
const methodoverride = require("method-override");
const { listingSchema, reviewSchema } = require("./schema_validation.js");
const { error } = require("console");
const { validateHeaderValue } = require("http");
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
//...............schema validation middleware...............//
const validateListing = (req, res, next) => {

    let { error } = listingSchema.validate(req.body);
    if (error) {
        console.log(error)
        next(err.details).message;
    }
}
//...........Review validation...............//
const validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        console.log(error);
        let msg = error.details.map(el => el.message).join(",");
        let err = new Error(msg);
        err.status = 400;
        return next(err);
    }
    next();
}

//................Home route is here..................//
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
app.get("/partner", (req, res) => {
    res.render("./listings/new_listing_form.ejs");
})
//..............New listing route......................//
app.post("/new_listings", asyncWrap(async (req, res, next) => {
    let url_local = "https://images.pexels.com/photos/271816/pexels-photo-271816.jpeg?auto=compress&cs=tinysrgb&w=600";
    const data = {
        descreption: req.body.descreption,
        url: url_local,
        address: req.body.address,
        address2: req.body.address2,
        city: req.body.city,
        state: req.body.state,
        pincode: req.body.pincode
    };

    let result = listingSchema.validate(req.body);
    console.log("result is", result.error.details);
    if (error) {
        next(result.error.details);
        return;
    }
    let data_saved = new product_data(data);
    await data_saved.save().then((result) => {
        console.log(result);
        res.send("data saved successfully");
    })
}))
//..................After click on product view route is here...............//
app.get("/product/:id/view", asyncWrap(async (req, res, next) => {

    let { id } = req.params;
    const data_found_in_db = await product_data.findById(id);
    console.log(data_found_in_db);
    res.render("./listings/view_product.ejs", { data_found_in_db });


}))
//...............Edit Route is Here............// 
app.get("/edit/:id/product", asyncWrap(async (req, res, next) => {
    console.log("edit route hitten");
    let { id } = req.params;
    console.log(id);
    const data_found_to_edit = await product_data.findById(id);
    console.log("data found for editing", data_found_to_edit);
    res.render("./listings/edit_form.ejs", { data_found_to_edit });


}))
app.put("/product/:id", validateListing, asyncWrap(async (req, res, next) => {
    let { id } = req.params;
    console.log(req.body);

    let edited_data_found = await product_data.findByIdAndUpdate(id, { ...req.body });
    console.log("edited data is", edited_data_found);
    res.redirect(`/product/${id}/view`);
})
)
//.................route for deletion of product.........................//
app.delete("/product/:id", asyncWrap(async (req, res, next) => {
    let { id } = req.params;

    let deleted_data = await product_data.findByIdAndDelete(id);
    res.redirect("/");

})
)
//.............Review Route..............//
app.post("/listing/:id/review", validateReview, asyncWrap(async (req, res, next) => {
    const { id } = req.params;
    const listed_data = await product_data.findById(id);

    if (!listed_data) {
        const err = new Error("Listing not found");
        err.status = 404;
        return next(err);
    }

    const { rating, comment } = req.body.listing;
    const review = new Review({ rating, comment });

    listed_data.reviews.push(review);
    await review.save();
    await listed_data.save();

    res.send("Review saved successfully");
}));

//................Wrap Error Function.....................//
function asyncWrap(fn) {
    return function (req, res, next) {
        fn(req, res, next).catch((err) => {
            next(err);
        })
    }
}
//................Error middleware.................//
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