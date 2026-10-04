const path = require('path');
const fs = require('fs');
const { initCloudinary, isCloudinaryConfigured } = require('../config/cloudinary');

// Ensure local uploads directory exists (fallback only)
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// @desc    Upload an image (Streams to Cloudinary CDN with eco-bandwidth optimization)
// @route   POST /api/upload
// @access  Public (for customer review photo) or Admin
const uploadImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an image file to upload',
      });
    }

    // Check if Cloudinary is configured
    if (isCloudinaryConfigured()) {
      const cloudinary = initCloudinary();

      return new Promise((resolve, reject) => {
        // Ultra-bandwidth optimization:
        // 1. auto:eco quality: Reduces bytes by ~65% while keeping order text crystal clear
        // 2. fetch_format auto: Serves modern AVIF / WebP to supported devices
        // 3. strip_profile: Removes EXIF metadata (GPS, phone details, camera headers)
        // 4. width 900 limit: Ideal for screenshot proof viewing without wasting 4K bandwidth
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: 'pillowala/reviews',
            resource_type: 'image',
            transformation: [
              {
                width: 900,
                height: 1200,
                crop: 'limit',
                quality: 'auto:eco',
                fetch_format: 'auto',
                flags: 'strip_profile',
              },
            ],
          },
          (error, result) => {
            if (error) {
              console.error('Cloudinary Upload Error:', error);
              return res.status(500).json({
                success: false,
                message: 'Failed to upload image to Cloudinary: ' + error.message,
              });
            }

            // Create optimized CDN delivery URL
            const optimizedDeliveryUrl = cloudinary.url(result.public_id, {
              secure: true,
              transformation: [
                {
                  width: 900,
                  height: 1200,
                  crop: 'limit',
                  quality: 'auto:eco',
                  fetch_format: 'auto',
                  flags: 'strip_profile',
                },
              ],
            });

            resolve(
              res.status(200).json({
                success: true,
                message: 'Image uploaded and bandwidth-optimized successfully to Cloudinary Cloud',
                url: optimizedDeliveryUrl || result.secure_url,
                publicId: result.public_id,
                bytes: result.bytes,
                format: result.format,
              })
            );
          }
        );

        stream.end(req.file.buffer);
      });
    }

    // Fallback: Save file asynchronously in backend/uploads (when Cloudinary keys are absent)
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const extension = path.extname(req.file.originalname) || '.webp';
    const filename = `review-${uniqueSuffix}${extension}`;
    const targetFilePath = path.join(uploadsDir, filename);

    await fs.promises.writeFile(targetFilePath, req.file.buffer);

    // Build URL accessible by frontend
    const protocol = req.protocol;
    const host = req.get('host');
    const localUrl = `${protocol}://${host}/uploads/${filename}`;

    return res.status(200).json({
      success: true,
      message: 'Image saved locally',
      url: localUrl,
      filename,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  uploadImage,
};
