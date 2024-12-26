const fs = require('fs').promises;
const path = require('path');
const { logError } = require('./logger');

const deleteFile = async (filePath) => {
  try {
    await fs.unlink(path.join(__dirname, '../../', filePath));
  } catch (error) {
    await logError(error, 'File deletion failed');
  }
};

const cleanupPhotos = async (photos) => {
  for (const photo of photos) {
    const filePath = photo.photo_url.replace('/uploads/', 'uploads/');
    await deleteFile(filePath);
  }
};

module.exports = {
  deleteFile,
  cleanupPhotos
};