const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/Auth.middlewear");

const { updateProfile, getProfile ,sendCookie} = require("../controllers/vendor.controller");

router.get('/profile', authMiddleware, getProfile);
router.post('/updateProfile', authMiddleware, updateProfile);
router.get('/dev',sendCookie);

module.exports = router;