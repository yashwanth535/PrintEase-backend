const express = require("express");
const router = express.Router();

const { updateProfile, getProfile } = require("../controllers/vendor.controller");

router.get('/profile', getProfile);
router.post('/updateProfile', updateProfile);

module.exports = router;