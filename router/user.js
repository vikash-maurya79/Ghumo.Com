const express = require("express");
const router = express.Router();
const passport = require("passport");
const { saveredirectUrl } = require("../authentication/authentication.js");
const userController = require("../controller/user.js");

router.route("/signup")
    .get(userController.renderSignupForm)
    .post(userController.userSignupPost);


router.route("/login")
    .get(userController.renderLoginForm)
    .post(saveredirectUrl, passport.authenticate("local", { failureRedirect: "/login", failureFlash: true }), userController.loginPostRoute);


module.exports = router;