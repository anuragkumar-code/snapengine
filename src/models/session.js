const db = require('../config/db');

const createSession = async ({ user_id, token, ip_address, user_agent, expires_at }) => {
  await db.execute(
    `INSERT INTO user_sessions (user_id, token, ip_address, user_agent, expires_at) 
     VALUES (?, ?, ?, ?, ?)`,
    [user_id, token, ip_address, user_agent, expires_at]
  );
};

const findSessionByToken = async (token) => {
  const [rows] = await db.execute(
    'SELECT * FROM user_sessions WHERE token = ? AND is_active = TRUE',
    [token]
  );
  return rows[0];
};

const invalidateSession = async (token) => {
  await db.execute(
    'UPDATE user_sessions SET is_active = FALSE WHERE token = ?',
    [token]
  );
};

const invalidateAllSessionsForUser = async (user_id) => {
  await db.execute(
    'UPDATE user_sessions SET is_active = FALSE WHERE user_id = ?',
    [user_id]
  );
};

module.exports = {
  createSession,
  findSessionByToken,
  invalidateSession,
  invalidateAllSessionsForUser,
};
