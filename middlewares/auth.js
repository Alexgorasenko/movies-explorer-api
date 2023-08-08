const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../utils/UnauthorizedError');
const config = require('../config');

const auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return next(new UnauthorizedError('При авторизации произошла ошибка. Токен не передан или передан не в том формате'));
  }

  const token = authorization.replace('Bearer ', '');

  let payload;
  if (!token) {
    next(new UnauthorizedError('При авторизации произошла ошибка. Токен не передан или передан не в том формате'));
  }
  try {
    payload = jwt.verify(token, config.JWT_SECRET);
  } catch (err) {
    next(new UnauthorizedError('При авторизации произошла ошибка. Переданный токен некорректен.'));
  }

  req.user = payload;

  return next();
};

module.exports = { auth };
