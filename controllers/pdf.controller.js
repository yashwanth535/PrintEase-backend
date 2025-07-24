const supabase = require('../config/supabase.config');
const multer = require('multer');

// Sanitize filenames to remove unsafe characters
const sanitizeFileName = (filename) => {
  return filename.replace(/[^a-zA-Z0-9._-]/g, '-'); // replace anything unsafe with hyphen
};

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
}).single('file'); // Accepts any type of file

const uploadFile = async (req, res) => {
  console.log("Uploading file");
  upload(req, res, async (err) => {
    try {
      if (err) return res.status(400).json({ error: err.message });
      if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

      const file = req.file;
      const timestamp = Date.now();
      const safeFileName = `${timestamp}-${sanitizeFileName(file.originalname)}`;

      const { data, error } = await supabase.storage
        .from('printease')
        .upload(safeFileName, file.buffer, {
          contentType: file.mimetype || 'application/octet-stream',
          cacheControl: '3600',
          upsert: true,
        });

      if (error) {
        console.error('Supabase storage error:', error);
        return res.status(500).json({ error: 'Error uploading to storage' });
      }

      const publicUrl = supabase.storage.from('printease').getPublicUrl(safeFileName).data.publicUrl;

      res.status(200).json({
        message: 'File uploaded successfully',
        fileName: safeFileName,
        url: publicUrl,
      });
    } catch (error) {
      console.error('Server error:', error);
      res.status(500).json({ error: 'Server error' });
    }
  });
};

module.exports = { uploadFile };
