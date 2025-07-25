const joi = require("joi");
module.exports.listingSchema = joi.object({
    descreption: joi.string().required(),
    url:joi.string(),
    address: joi.string().required(),
    address2: joi.string(),
    city: joi.string().required(),
    state: joi.string().required(),
    pincode: joi.number().required()
});
module.exports.reviewSchema = joi.object({
    listing:joi.object({
        rating:joi.number().required(),
        comment:joi.string().required()
    })
})