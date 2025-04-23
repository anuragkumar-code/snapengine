const db = require('../config/db');

const findUserByEmail = async (email) => {
  const [users] = await db.execute(
    'SELECT * FROM users WHERE email = ?',
    [email]
  );
  return users[0];
};

const createUser = async (userData) => {
  const {
    firstName,
    surname,
    dob,
    gender,
    mobile,
    email,
    password
  } = userData;

  const [result] = await db.execute(
    `INSERT INTO users 
      (first_name, surname, dob, gender, mobile, email, password) 
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [firstName, surname, dob, gender, mobile, email, password]
  );

  const [newUser] = await db.execute(
    `SELECT id, first_name, surname, dob, gender, mobile, email 
     FROM users WHERE id = ?`,
    [result.insertId]
  );

  return newUser[0];
};

module.exports = {
  findUserByEmail,
  createUser
};
