const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const logger = require('../config/logger'); 

class ImageService {
  static async compressAndSaveImage(fileBuffer, originalName) {
    try {
      const uploadDir = path.join(__dirname, '..', 'uploads');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir);
        logger.info('📁 Upload directory created at ' + uploadDir);
      }

      const fileName = Date.now() + '-' + originalName.split(' ').join('_');
      const filePath = path.join(uploadDir, fileName);

      logger.info(`📥 Starting compression for: ${originalName}`);

      const compressedBuffer = await sharp(fileBuffer)
        .jpeg({ quality: 70 }) 
        .toBuffer();

      fs.writeFileSync(filePath, compressedBuffer);

      const sizeInKB = (compressedBuffer.length / 1024).toFixed(2);

      return {
        fileName: fileName,
        filePath: filePath,
        sizeInKB
      };
    } catch (error) {
      logger.error('❌ Error in compressAndSaveImage:', error);
      throw error;
    }
  }
}

module.exports = ImageService;
