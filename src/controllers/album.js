const { validateAlbum } = require('../utils/validation');
const { getPagination, getPagingData } = require('../utils/pagination');
const { logError } = require('../utils/logger');
const { cleanupPhotos } = require('../utils/cleanup');
const { 
  createAlbum, 
  getAlbumsByUser, 
  getAlbumById,
  updateAlbum,
  deleteAlbum 
} = require('../models/album');
const { 
  addPhotosToAlbum, 
  getPhotosByAlbum,
  deletePhoto,
  getPhotoById 
} = require('../models/photo');
const { uploadToStorage } = require('../utils/fileUpload');
const ImageService = require('../service/ImageService'); 

// const create = async (req, res) => {
//   try {
//     const { title, description } = req.body;
//     const userId = req.user.userId;

//     const validation = validateAlbum({ title, description });
//     if (!validation.isValid) {
//       return res.status(400).json({ errors: validation.errors });
//     }

//     const albumId = await createAlbum(userId, title, description);

//     if (!req.files || req.files.length === 0) {
//       return res.status(400).json({ message: 'No photos provided' });
//     }

//     const photoUrls = await Promise.all(
//       req.files.map(file => uploadToStorage(file))
//     );

//     const photos = photoUrls.map(url => ({
//       albumId,
//       url
//     }));

//     await addPhotosToAlbum(photos);

//     res.status(201).json({
//       message: 'Album created successfully',
//       albumId
//     });
//   } catch (error) {
//     await logError(error, 'Album creation');
//     res.status(500).json({ message: 'Server error' });
//   }
// };

const create = async (req, res) => {
  try {
    const userId = req.user.userId;

    const {
      title,
      description,
      eventDate,
      tags,
      category,
      privacy,
      location,
      commentsEnabled,
    } = req.body;

    const validation = validateAlbum({ title, description });
    if (!validation.isValid) {
      return res.status(400).json({ errors: validation.errors });
    }

    let coverPhotoUrl = null;

    if (req.files?.coverPhoto) {
      const coverPhoto = req.files.coverPhoto[0];
      const result = await ImageService.compressAndSaveImage(coverPhoto.buffer, coverPhoto.originalname);
      coverPhotoUrl = result.filePath; 
    }

    let photoUrls = [];

    if (req.files?.photos && req.files.photos.length > 0) {
      photoUrls = await Promise.all(
        req.files.photos.map(async (file) => {
          const result = await ImageService.compressAndSaveImage(file.buffer, file.originalname);
          return result.filePath; 
        })
      );
    }

    const albumId = await createAlbum(userId, {
      title,
      description,
      eventDate,
      coverPhotoUrl,
      tags,
      category,
      privacy,
      location,
      commentsEnabled: commentsEnabled === 'true' || commentsEnabled === true,
    });

    if (photoUrls.length > 0) {
      const photos = photoUrls.map((url) => ({
        albumId,
        url,
      }));
      await addPhotosToAlbum(photos);
    }

    res.status(201).json({
      message: 'Album created successfully',
      albumId,
    });
  } catch (error) {
    await logError(error, 'Album creation');
    res.status(500).json({ message: 'Server error' });
  }
};


const getAlbums = async (req, res) => {
  try {
    const { page, limit } = req.query;
    const userId = req.user.userId;
    const { limit: limitValue, offset } = getPagination(page, limit);
    
    const data = await getAlbumsByUser(userId, limitValue, offset);
    const response = getPagingData(data, page, limitValue);
    
    res.json(response);
  } catch (error) {
    await logError(error, 'Get albums');
    res.status(500).json({ message: 'Server error' });
  }
};


const getAlbumDetails = async (req, res) => {
  try { 
    const { albumId } = req.params;
    const { page, limit } = req.query;
    const userId = req.user.userId;
    console.log(req.params);
    const album = await getAlbumById(albumId, userId);
    if (!album) {
      return res.status(404).json({ message: 'Album not found' });
    }

    const { limit: limitValue, offset } = getPagination(page, limit);
    const photosData = await getPhotosByAlbum(albumId, limitValue, offset);
    const photos = getPagingData(photosData, page, limitValue);
    
    res.json({
      ...album,
      photos
    });
  } catch (error) {
    await logError(error, 'Get album details');
    res.status(500).json({ message: 'Server error' });
  }
};

const update = async (req, res) => {
  try {
    const { albumId } = req.params;
    const { title, description } = req.body;
    const userId = req.user.userId;

    const validation = validateAlbum({ title, description });
    if (!validation.isValid) {
      return res.status(400).json({ errors: validation.errors });
    }

    const success = await updateAlbum(albumId, userId, title, description);
    if (!success) {
      return res.status(404).json({ message: 'Album not found' });
    }

    res.json({ message: 'Album updated successfully' });
  } catch (error) {
    await logError(error, 'Update album');
    res.status(500).json({ message: 'Server error' });
  }
};

const remove = async (req, res) => {
  try {
    const { albumId } = req.params;
    const userId = req.user.userId;

    const photos = await getPhotosByAlbum(albumId);
    const success = await deleteAlbum(albumId, userId);
    
    if (!success) {
      return res.status(404).json({ message: 'Album not found' });
    }

    await cleanupPhotos(photos.rows);

    res.json({ message: 'Album deleted successfully' });
  } catch (error) {
    await logError(error, 'Delete album');
    res.status(500).json({ message: 'Server error' });
  }
};

const removePhoto = async (req, res) => {
  try {
    const { albumId, photoId } = req.params;
    const userId = req.user.userId;

    const album = await getAlbumById(albumId, userId);
    if (!album) {
      return res.status(404).json({ message: 'Album not found' });
    }

    const photo = await getPhotoById(photoId);
    if (!photo) {
      return res.status(404).json({ message: 'Photo not found' });
    }

    const success = await deletePhoto(photoId, albumId);
    if (success) {
      await cleanupPhotos([photo]);
      res.json({ message: 'Photo deleted successfully' });
    } else {
      res.status(404).json({ message: 'Photo not found' });
    }
  } catch (error) {
    await logError(error, 'Delete photo');
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  create,
  getAlbums,
  getAlbumDetails,
  update,
  remove,
  removePhoto
};