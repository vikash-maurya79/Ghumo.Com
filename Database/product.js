const mongoose = require("mongoose");
let Review = require("./review.js");
const productSchema = new mongoose.Schema({
    descreption: String,
    url: String,
    address: String,
    address2: String,
    city: String,
    state: String,
    pincode: Number,
    reviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Review"
        }
    ],
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }

})
//................Review that is associated with Product Delete middleware is here....//
productSchema.post("findOneAndDelete", async (product_data) => {
    if (product_data) {
        await Review.deleteMany({ _id: { $in: product_data.reviews } });
    }

})
const product_data = mongoose.model("product_data", productSchema);
module.exports = product_data;