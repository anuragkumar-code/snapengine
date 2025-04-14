const express = require('express');
const router = express.Router();
const { 
  create, 
  getAlbums, 
  getAlbumDetails,
  update,
  remove,
  removePhoto
} = require('../controllers/album');

const protect = require('../middleware/auth');

const { upload } = require('../utils/fileUpload');

router.post('/', protect, upload.array('photos', 10), create);
router.get('/', protect, getAlbums);
router.get('/:albumId', protect, getAlbumDetails);
router.put('/:albumId', protect, update);
router.delete('/:albumId', protect, remove);
router.delete('/:albumId/photos/:photoId', protect, removePhoto);


module.exports = router;