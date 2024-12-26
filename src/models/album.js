const db = require('../config/db');

const createAlbum = async (userId, title, description) => {
  const [result] = await db.execute(
    'INSERT INTO albums (user_id, title, description, created_at) VALUES (?, ?, ?, NOW())',
    [userId, title, description]
  );
  return result.insertId;
};

const getAlbumsByUser = async (userId, limit, offset) => {
  const [albums] = await db.execute(
    'SELECT * FROM albums WHERE user_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?',
    [userId, limit, offset]
  );
  
  const [count] = await db.execute(
    'SELECT COUNT(*) as count FROM albums WHERE user_id = ?',
    [userId]
  );
  
  return {
    count: count[0].count,
    rows: albums
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
  deleteAlbum
};