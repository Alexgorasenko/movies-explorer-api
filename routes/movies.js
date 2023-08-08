const express = require('express');

const router = express.Router();

const {
  createMovie, getMovies, deleteMovie,
} = require('../controllers/movies');

const celebrate = require('../middlewares/celebrate');

router.post('/', celebrate.validateCreateMovie, createMovie);
router.get('/', getMovies);
router.delete('/:_id', celebrate.validateMovieId, deleteMovie);
module.exports = router;
