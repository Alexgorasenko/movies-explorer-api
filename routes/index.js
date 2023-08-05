const express = require('express');
const { auth } = require('../middlewares/auth');
// const celebrate = require('../middlewares/celebrate');
const NotFoundError = require('../utils/NotFoundError');

const router = express.Router();

const {
  createUser, login,
} = require('../controllers/users');

const usersRouter = require('./users');

router.use('/signin', login);
router.use('/signup', createUser);

router.use(auth);

router.use('/users', usersRouter);

router.use('/*', (req, res, next) => {
  next(new NotFoundError('Страница не найдена'));
});

module.exports = router;
