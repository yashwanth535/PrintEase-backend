const supabase = require('../config/supabaseConfig');
const multer = require('multer');

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed!'), false);
    }
  },
}).single('pdf');

const uploadPdf = async (req, res) => {
  console.log("uploading pdf");
  upload(req, res, async (err) => {
    try {
      if (err) return res.status(400).json({ error: err.message });
      if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

      const file = req.file;
      const timestamp = Date.now();
      const fileName = `${timestamp}-${file.originalname}`;

      // Upload file to Supabase Storage (Using "printease" bucket)
      const { data, error } = await supabase.storage
        .from('printease') // Updated bucket name here
        .upload(fileName, file.buffer, {
          contentType: 'application/pdf',
          cacheControl: '3600',
          upsert: true, // Allows overwriting existing files
        });

      if (error) {
        console.error('Supabase storage error:', error);
        return res.status(500).json({ error: 'Error uploading to storage' });
      }

      // Get the public URL of the uploaded file
      const publicUrl = supabase.storage.from('printease').getPublicUrl(fileName).data.publicUrl;

      res.status(200).json({
        message: 'File uploaded successfully',
        fileName,
        url: publicUrl,
      });
    } catch (error) {
      console.error('Server error:', error);
      res.status(500).json({ error: 'Server error' });
    }
  });
};

module.exports = { uploadPdf };
