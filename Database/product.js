const mongoose = require("mongoose");
let Review = require("./review.js");
const { required } = require("joi");
const productSchema = new mongoose.Schema({
    title:String,
    descreption: String,
    address: String,
    address2: String,
    city: String,
    state: String,
    pincode: Number,
    price:Number,
    area:String,
    image:{
        url:String,
        filename:String
    },
    reviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Review"
        }
    ],
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
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