const express = require("express");
const router = express.Router();
const { asyncWrap } = require("../authentication/authentication");
const controller = require("../controller/home");


router.route("/")
    .get(asyncWrap(controller.index));

module.exports = router;