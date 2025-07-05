const express = require("express");
const router = express.Router();
const {isLoggedIn,isOwner} = require("../authentication/authentication.js");
const listingController = require("../controller/listing.js");
const {asyncWrap}= require("../authentication/authentication.js");
const multer  = require('multer');
const {storage} = require("../CloudinaryConfig.js");
const upload = multer({storage});
if(process.env.NODE_ENV !="production"){
require('dotenv').config();
}

router.get("/partner",isLoggedIn,listingController.newForm);

router.post("/new_listings",isLoggedIn,upload.single('image'),listingController.listingPartner);


router.get("/:id/view",asyncWrap(listingController.viewListing));

router.get("/:id/edit",isLoggedIn, isOwner,asyncWrap(listingController.editListing_get));

router.put("/:id",isOwner,upload.single(`image`),asyncWrap(listingController.editListing_put));


//.................route for deletion of product.........................//
router.delete("/:id",isLoggedIn, asyncWrap(listingController.deleteListing));


module.exports=router;