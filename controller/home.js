let product_data = require("../Database/product");



module.exports.index = async (req, res, next) => {
   
    const data = await product_data.find({});
    res.render("./listings/home.ejs", { data });
}