const express = require("express");
const router = express.Router();
const product_data = require("../Database/product");
const { listingSchema, reviewSchema } = require("../schema_validation.js");
const {isLoggedIn,isOwner} = require("../authentication/authentication.js");


const validateListing = (req, res, next) => {

    let { error } = listingSchema.validate(req.body);
    if (error) {
        console.log(error);
        next(err.details).message;
    }
}

router.get("/partner",isLoggedIn,(req,res,next) => {

    res.render("./listings/new_listing_form.ejs");
})
router.post("/new_listings",isLoggedIn, asyncWrap(async (req, res, next) => {
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
    data.owner=req.user._id;
    let data_saved = new product_data(data);
    await data_saved.save().then((result) => {
        console.log(result);
        req.flash("success","New item Listed!");
        res.redirect("/");
    })
}))
router.get("/:id/view",asyncWrap(async (req, res, next) => {

    let { id } = req.params;
    const data_found_in_db = await product_data.findById(id).populate({path:"reviews",populate:{path:"author"}}).populate("owner");
    let rating_num = 0;
    let i = 0;
    for (rating_number of data_found_in_db.reviews) {
        rating_num += rating_number.rating
        i++;
    }
    let avg_rating;
    
    if (rating_num == 0) {
        avg_rating = "Rating not found";
    }
    else {
        avg_rating = rating_num / i;
    }
    res.render("./listings/view_product.ejs", { data_found_in_db, avg_rating });
}))



router.get("/:id/edit",isLoggedIn, isOwner,asyncWrap(async (req, res, next) => {
    console.log("edit route hitten");
    let { id } = req.params;
    
    const data_found_to_edit = await product_data.findById(id);
    
    res.render("./listings/edit_form.ejs", { data_found_to_edit });


}))
router.put("/:id",isOwner,asyncWrap(async (req, res, next) => {
    let { id } = req.params;
    let edited_data_found = await product_data.findByIdAndUpdate(id, { ...req.body });

    req.flash("success","Listing Updated successfully !")
    res.redirect(`/product/${id}/view`);
})
)
//.................route for deletion of product.........................//
router.delete("/:id",isLoggedIn, asyncWrap(async (req, res, next) => {
    let { id } = req.params;
    let listing =await product_data.findById(id);
    if(!listing.owner._id.equals(res.locals.currentUser._id)){
        req.flash("error","You are not authorised to delete");
        return res.redirect(`/product/${id}/view`);
    }
    let deleted_data = await product_data.findByIdAndDelete(id);
    req.flash("success","Listing deleted successfully");
    res.redirect("/");

})
)
function asyncWrap(fn) {
    return function (req, res, next) {
        fn(req, res, next).catch((err) => {
            next(err);
        })
    }
}
module.exports=router;