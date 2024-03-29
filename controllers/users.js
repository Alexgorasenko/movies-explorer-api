const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const config = require('../config');

const BadRequestError = require('../utils/BadRequestError');

const ConflictingError = require('../utils/ConflictingError');

// const NotFoundError = require('../utils/NotFoundError');

const UnauthorizedError = require('../utils/UnauthorizedError');

const SALT_ROUNDS = 10;

const createUser = (req, res, next) => {
  const { password } = req.body;

  bcrypt.hash(password, SALT_ROUNDS).then((hash) => {
    User.create({
      ...req.body,
      password: hash,
    })
      .then((user) => {
        const {
          _id, name, about, avatar, email,
        } = user;
        res.send({
          _id, name, about, avatar, email,
        });
      })
      .catch((err) => {
        if (err.name === 'ValidationError') {
          next(
            new BadRequestError(
              'При регистрации пользователя произошла ошибка',
            ),
          );
        } else if (err.code === 11000) {
          next(
            new ConflictingError('Пользователь с таким email уже существует'),
          );
        } else {
          next(err);
        }
      });
  });
};

const getUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      res.send({
        email: user.email,
        name: user.name,
      });
    })
    .catch(next);
};

const updateUser = (req, res, next) => {
  const { email, name } = req.body;
  User.findByIdAndUpdate(req.user._id, { email, name }, { new: true, runValidators: true })
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(
          new BadRequestError(
            'При обновлении профиля произошла ошибка',
          ),
        );
      } else if (err.code === 11000) {
        next(
          new ConflictingError('Пользователь с таким email уже существует'),
        );
      } else {
        next(err);
      }
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        throw new UnauthorizedError('Вы ввели неправильный логин или пароль.');
      } else {
        return bcrypt
          .compare(password, user.password)
          .then((isValidUser) => {
            if (isValidUser) {
              const token = jwt.sign({ _id: user._id }, config.JWT_SECRET);
              res.send({
                token,
              });
            } else {
              throw new UnauthorizedError('При авторизации произошла ошибка. Переданный токен некорректен.');
            }
          })
          .catch(next);
      }
    })
    .catch(next);
};

module.exports = {
  createUser,
  getUser,
  updateUser,
  login,
};
