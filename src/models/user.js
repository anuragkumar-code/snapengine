// In-memory user storage (replace with a real database in production)
const users = [];

const findUserByEmail = (email) => {
  return users.find(user => user.email === email);
};

const createUser = (userData) => {
  const newUser = {
    id: Date.now().toString(),
    ...userData
  };
  users.push(newUser);
  return newUser;
};

module.exports = {
  findUserByEmail,
  createUser
};