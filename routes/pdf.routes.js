const express = require('express');
const router = express.Router();
const { signedUrl } = require('../controllers/pdf.controller');

router.post('/signed-url',signedUrl)

module.exports = router; 