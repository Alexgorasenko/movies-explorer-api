const Movie = require('../models/movie');

const BadRequestError = require('../utils/BadRequestError');

const ForbiddenError = require('../utils/ForbiddenError');

const NotFoundError = require('../utils/NotFoundError');

const createMovie = (req, res, next) => {
  Movie.create({
    ...req.body,
    owner: req.user._id,
  })
    .then((movie) => {
      res.send(movie);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(
          new BadRequestError('Переданы некорректные данные при создании карточки'),
        );
      } else {
        next(err);
      }
    });
};

const getMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .then((movies) => {
      res.send(movies);
    })
    .catch(next);
};

const deleteMovie = (req, res, next) => {
  const { _id } = req.params;

  Movie.findById(_id)
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError('Фильм с указанным id не найден');
      } else if (movie.owner.toString() !== req.user._id) {
        return Promise.reject(
          new ForbiddenError('Вы не можете удалить этот фильм'),
        );
      }
      return Movie.deleteOne(movie).then(() => {
        res.status(200).send({ message: 'Фильм удалён!' });
      });
    })
    .catch(next);
};

module.exports = {
  createMovie,
  getMovies,
  deleteMovie,
};
