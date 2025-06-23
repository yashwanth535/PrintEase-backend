const express = require('express');
const router = express.Router();
const { uploadPdf } = require('../controllers/pdfController');

router.post('/upload-pdf', uploadPdf);

module.exports = router; 