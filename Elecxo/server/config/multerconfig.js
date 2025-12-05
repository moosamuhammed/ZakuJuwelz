const multer = require('multer');
const path = require('path');

// Set up storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // The folder where the image will be saved
  },
  filename: (req, file, cb) => {
    // Rename file to avoid conflicts (timestamp added)
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

// Filter to allow only image files (optional)
const fileFilter = (req, file, cb) => {
  const fileTypes = /jpeg|jpg|png|webp|pdf|gif/;
  const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimeType = fileTypes.test(file.mimetype);

  if (extname && mimeType) {
    return cb(null, true);
  } else {
    cb('Error: Only image files are allowed!');
  }
};

// Multer configuration
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 40 * 1024 * 1024 } // 5MB file size limit
});

module.exports = upload;
