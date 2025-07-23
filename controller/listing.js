const { asyncWrap } = require("../authentication/authentication");
const product_data = require("../Database/product");
const ExpressError = require("../ExpressError");


module.exports.newForm = (req, res, next) => {
    res.render("./listings/new_listing_form.ejs");
}

module.exports.listingPartner = asyncWrap(async (req, res) => {
    let url = req.file.path;
    let filename = req.file.filename;
    const data = {
        title: req.body.title,
        descreption: req.body.descreption,
        address: req.body.address,
        address2: req.body.address2,
        city: req.body.city,
        state: req.body.state,
        pincode: req.body.pincode,
        price: req.body.price,
        area:req.body.area
    };
    data.owner = req.user._id;

    let data_saved = new product_data(data);
    data_saved.image = await{ url, filename };
    await data_saved.save();
    req.flash("success", "New item Listed!");
    res.redirect("/");

})

module.exports.viewListing = async (req, res, next) => {

    let { id } = req.params;

    const data_found_in_db = await product_data.findById(id).populate({ path: "reviews", populate: { path: "author" } }).populate("owner");


    console.log(data_found_in_db);
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
}

module.exports.editListing_get = async (req, res, next) => {
    let { id } = req.params;

    const data_found_to_edit = await product_data.findById(id);

    res.render("./listings/edit_form.ejs", { data_found_to_edit });
}


module.exports.editListing_put = async (req, res, next) => {
    let { id } = req.params;
    let edited_data_found = await product_data.findByIdAndUpdate(id, { ...req.body });
    if (typeof req.file != "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        edited_data_found.image = { url, filename };
        edited_data_found.save();
    }

    req.flash("success", "Listing Updated successfully !")
    res.redirect(`/product/${id}/view`);
}

module.exports.deleteListing = async (req, res, next) => {
    let { id } = req.params;
    let listing = await product_data.findById(id);
    if (!listing.owner._id.equals(res.locals.currentUser._id)) {
        req.flash("error", "You are not authorised to delete");
        return res.redirect(`/product/${id}/view`);
    }
    let deleted_data = await product_data.findByIdAndDelete(id);
    req.flash("success", "Listing deleted successfully");
    res.redirect("/");
}
module.exports.search = async (req,res,next)=>{
    const locat= req.body.search;
    let location = locat.charAt(0).toUpperCase()+locat.slice(1);

    console.log("location is",location);

    try{
        let data_founded =await product_data.find({city:location});
        if(data_founded && data_founded.length>0){
         console.log(data_founded);
        res.render("./listings/home.ejs", { data: data_founded });

        }
        else{
      let data = "Nothing found !";
        res.render("./listings/error.ejs",{data});
        }
      
    }
    catch(err){
        console.log(err.message);
    }
    
}