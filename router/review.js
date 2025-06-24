const express = require("express");
const router = express.Router();
const product_data = require("../Database/product")
const Review = require("../Database/review.js");
const { reviewSchema } = require("../schema_validation.js");


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
function asyncWrap(fn) {
    return function (req, res, next) {
        fn(req, res, next).catch((err) => {
            next(err);
        })
    }
}

router.post("/:id", validateReview, asyncWrap(async (req, res, next) => {
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
    req.flash("success","Thanks for your review");

    res.redirect(`/product/${id}/view`);
}));
router.delete("/:id/:review_id", asyncWrap(async (req, res, next) => {
    let { id, review_id } = req.params;
    await product_data.findByIdAndUpdate(id, { $pull: { reviews: review_id } });
    await Review.findByIdAndDelete(review_id);
    console.log("user is is ", id, "and review id is", review_id);
    req.flash("success","Review deleted");
    res.redirect(`/product/${id}/view`);
}))
module.exports=router;