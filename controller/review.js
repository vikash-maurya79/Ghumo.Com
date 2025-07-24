const product_data = require("../Database/product");
const Review = require("../Database/review");



module.exports.review_post = async (req, res, next) => {
    const { id } = req.params;
    const listed_data = await product_data.findById(id);

    if (!listed_data) {
        const err = new Error("Listing not found");
        err.status = 404;
        return next(err);
    }

    const { rating, comment } = req.body.listing;
    const review = new Review({ rating, comment });
    review.author = req.user._id;
    listed_data.reviews.push(review);
    await review.save();
    await listed_data.save();
    req.flash("success", "Thanks for your review");

    res.redirect(`/product/${id}/view`);
};


module.exports.review_delete = async (req, res, next) => {
    let { id, review_id } = req.params;
    console.log("id is ", id, "review id is ", review_id);
    let review = await Review.findById(review_id);
    console.log(review);
    await product_data.findByIdAndUpdate(id, { $pull: { reviews: review_id } });
    await Review.findByIdAndDelete(review_id);

    req.flash("success", "Review deleted");
    res.redirect(`/product/${id}/view`);
}