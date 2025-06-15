const mongoose = require("mongoose");
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
    ]

})
const product_data = mongoose.model("product_data", productSchema);
module.exports = product_data;