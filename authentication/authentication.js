const product_data = require("../Database/product");
const {reviewSchema} = require("../schema_validation");

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        console.log("working");

        return res.redirect("/user/login");
    }
    next();
}

module.exports.saveredirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}
module.exports.isOwner =async (req,res,next)=>{
    let {id}= req.params;
    let listing =await product_data.findById(id);
    if(!res.locals.currentUser._id.equals(listing.owner)){
         req.flash("error","Not authorised");
         return res.redirect(`/product/${id}/view`);
    }
    next();
}

module.exports.asyncWrap = function (fn) {
    return function (req, res, next) {
        fn(req, res, next).catch(next);
    }
}


module.exports.validateReview = (req, res, next) => {
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


// convert amount in indian rupees system with rupees symbol
exports.formatINR = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2
  }).format(amount);
};
