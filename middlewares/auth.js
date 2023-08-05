const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../utils/UnauthorizedError');
const config = require('../config');

const auth = (req, res, next) => {
  const { authorization } = req.headers;
  const token = authorization.replace('Bearer ', '');

  let payload;
  if (!token) {
    next(new UnauthorizedError('Неверный логин или пароль'));
  }
  try {
    payload = jwt.verify(token, config.JWT_SECRET);
  } catch (err) {
    next(new UnauthorizedError('Неверный логин или пароль'));
  }

  req.user = payload;

  return next();
};

module.exports = { auth };
