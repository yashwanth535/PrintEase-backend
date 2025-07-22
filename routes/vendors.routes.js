const {getLocations} = require("../controllers/vendors.controller")
const express = require("express");
const router = express.Router();

router.get("/locations",getLocations);

module.exports = router;