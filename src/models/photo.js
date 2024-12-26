const db = require('../config/db');

const addPhotosToAlbum = async (photos) => {
  const query = 'INSERT INTO photos (album_id, photo_url, created_at) VALUES ?';
  const values = photos.map(photo => [photo.albumId, photo.url, new Date()]);
  const [result] = await db.query(query, [values]);
  return result;
};

const getPhotosByAlbum = async (albumId, limit, offset) => {
  const [photos] = await db.execute(
    'SELECT * FROM photos WHERE album_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?',
    [albumId, limit, offset]
  );
  
  const [count] = await db.execute(
    'SELECT COUNT(*) as count FROM photos WHERE album_id = ?',
    [albumId]
  );
  
  return {
    count: count[0].count,
    rows: photos
  };
};

const deletePhoto = async (photoId, albumId) => {
  const [result] = await db.execute(
    'DELETE FROM photos WHERE id = ? AND album_id = ?',
    [photoId, albumId]
  );
  return result.affectedRows > 0;
};

const getPhotoById = async (photoId) => {
  const [photos] = await db.execute(
    'SELECT * FROM photos WHERE id = ?',
    [photoId]
  );
  return photos[0];
};

module.exports = {
  addPhotosToAlbum,
  getPhotosByAlbum,
  deletePhoto,
  getPhotoById
};