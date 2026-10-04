const multer = require('multer');
const path = require('path');

// Memory storage so we can either stream to Cloudinary or save to local disk
const storage = multer.memoryStorage();

// File filter: accept only JPG, JPEG, PNG, WEBP
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  const ext = path.extname(file.originalname).toLowerCase();
  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp'];

  if (allowedMimeTypes.includes(file.mimetype) && allowedExtensions.includes(ext)) {
    cb(null, true);
  } else {
    cb(
      new Error('Invalid image format. Only JPG, JPEG, PNG, and WEBP formats are supported.'),
      false
    );
  }
};

// Max size 15MB for raw mobile camera captures
const upload = multer({
  storage,
  limits: {
    fileSize: 15 * 1024 * 1024, // 15MB
  },
  fileFilter,
});

module.exports = upload;
