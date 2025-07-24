const express = require('express');
const router = express.Router();
const { uploadFile } = require('../controllers/pdf.controller');

router.post('/', uploadFile);

module.exports = router; 