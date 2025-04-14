const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/auth');
const protect = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
// router.post('/test', test);

router.get('/validate-token', protect, (req, res) => {
  res.status(200).json({
    valid: true,
    user: req.user, 
  });
});


module.exports = router;