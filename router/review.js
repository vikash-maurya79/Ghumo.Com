const express = require("express");
const router = express.Router();
const { isLoggedIn } = require("../authentication/authentication.js");
const reviewController = require("../controller/review.js");
const { asyncWrap } = require("../authentication/authentication.js");
const { validateReview } = require("../authentication/authentication.js");


router.post("/:id", isLoggedIn, validateReview,
    asyncWrap(reviewController.review_post));

router.delete("/:id/:review_id",
    asyncWrap(reviewController.review_delete));
module.exports = router;