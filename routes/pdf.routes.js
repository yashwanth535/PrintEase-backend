const express = require('express');
const router = express.Router();
const { uploadPdf } = require('../controllers/pdf.controller');

router.post('/upload-pdf', uploadPdf);

module.exports = router; 