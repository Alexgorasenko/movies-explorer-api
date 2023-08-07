const express = require('express');

const mongoose = require('mongoose');

const app = express();

const helmet = require('helmet');

const { errors } = require('celebrate');

const router = require('./routes/index');

const config = require('./config');

const error = require('./middlewares/error');

const cors = require('./middlewares/cors');

const limiter = require('./middlewares/rateLimit');

const { requestLogger, errorLogger } = require('./middlewares/logger');

mongoose.connect(config.MONGODB_URL);

app.use(express.json());

app.use(requestLogger);

app.use(helmet());

app.use(cors);

app.use(limiter);

app.use(router);

app.use(errorLogger);

app.use(errors());

app.use(error);
app.listen(config.PORT, () => {
  console.log('Сервер запущен!');
});
