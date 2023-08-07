const express = require('express');

const router = express.Router();

const {
  getUser, updateUser,
} = require('../controllers/users');

const celebrate = require('../middlewares/celebrate');

router.get('/me', getUser);
router.patch('/me', celebrate.validateUpdateUser, updateUser);

module.exports = router;
