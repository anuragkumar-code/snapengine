const db = require('../config/db');

// const createAlbum = async (userId, title, description) => {
//   const [result] = await db.execute(
//     'INSERT INTO albums (user_id, title, description, created_at) VALUES (?, ?, ?, NOW())',
//     [userId, title, description]
//   );
//   return result.insertId;
// };

const createAlbum = async (userId, albumData) => {
  const {
    title,
    description,
    eventDate,
    coverPhotoUrl,
    tags,
    category,
    privacy,
    location,
    commentsEnabled,
  } = albumData;

  const [result] = await db.execute(
    `INSERT INTO albums 
    (user_id, title, description, event_date, cover_photo_url, tags, category, privacy, location, comments_enabled, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
    [userId, title, description, eventDate, coverPhotoUrl, tags, category, privacy, location, commentsEnabled]
  );
  return result.insertId;
};

const getAlbumsByUser = async (userId, limit, offset) => {
  const [rows] = await db.execute(
    `SELECT * FROM albums WHERE user_id = ? LIMIT ${parseInt(limit)} OFFSET ${parseInt(offset)}`,
    [userId]
  );

  const [countResult] = await db.execute(
    'SELECT COUNT(*) as count FROM albums WHERE user_id = ?',
    [userId]
  );

  return {
    rows,
    count: countResult[0].count
  };
};

const getPhotosByAlbum = async (albumId, limit, offset) => {
  const [rows] = await db.execute(
    'SELECT * FROM photos WHERE album_id = ? LIMIT ? OFFSET ?',
    [albumId, limit, offset]
  );

  const [countResult] = await db.execute(
    'SELECT COUNT(*) as count FROM photos WHERE album_id = ?',
    [albumId]
  );

  return {
    rows,
    count: countResult[0].count
  };
};

const getAlbumById = async (albumId, userId) => {
  const [albums] = await db.execute(
    'SELECT * FROM albums WHERE id = ? AND user_id = ?',
    [albumId, userId]
  );
  return albums[0];
};

const updateAlbum = async (albumId, userId, title, description) => {
  const [result] = await db.execute(
    'UPDATE albums SET title = ?, description = ? WHERE id = ? AND user_id = ?',
    [title, description, albumId, userId]
  );
  return result.affectedRows > 0;
};

const deleteAlbum = async (albumId, userId) => {
  const [result] = await db.execute(
    'DELETE FROM albums WHERE id = ? AND user_id = ?',
    [albumId, userId]
  );
  return result.affectedRows > 0;
};

module.exports = {
  createAlbum,
  getAlbumsByUser,
  getAlbumById,
  updateAlbum,
  deleteAlbum,
  getPhotosByAlbum
};