const db = require('../config/db');

const findUserByEmail = async (email) => {
  const [users] = await db.execute(
    'SELECT * FROM users WHERE email = ?',
    [email]
  );
  return users[0];
};

const createUser = async (userData) => {
  const { name, email, password } = userData;
  const [result] = await db.execute(
    'INSERT INTO users (name, email, password, created_at) VALUES (?, ?, ?, NOW())',
    [name, email, password]
  );
  
  const [newUser] = await db.execute(
    'SELECT id, name, email, created_at FROM users WHERE id = ?',
    [result.insertId]
  );
  
  return newUser[0];
};

module.exports = {
  findUserByEmail,
  createUser
};