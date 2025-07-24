const express = require("express");
const router = express.Router();
const {sendCookie} = require("../controllers/user.controller");

router.get("/dev",sendCookie);

module.exports = router;