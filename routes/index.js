const express = require('express');
const { auth } = require('../middlewares/auth');
const celebrate = require('../middlewares/celebrate');
const NotFoundError = require('../utils/NotFoundError');

const router = express.Router();

const {
  createUser, login,
} = require('../controllers/users');

const usersRouter = require('./users');
const moviesRouter = require('./movies');

router.use('/signin', celebrate.validationLogin, login);
router.use('/signup', celebrate.validationCreateUser, createUser);

router.use(auth);

router.use('/users', usersRouter);
router.use('/movies', moviesRouter);

router.use('/*', (req, res, next) => {
  next(new NotFoundError('Страница по указанному маршруту не найдена'));
});

module.exports = router;
