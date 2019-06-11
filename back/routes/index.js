var express = require('express');
var router = express.Router();
var request = require('request');
var mongoose = require('mongoose');
var apiKey= //Your API key from the movie DB API;
var MovieModel = require('../models/movies');

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/movies', function(req, res, next) {
  //Here we request all the latest popular movies from tha API that will load when we start the application
  request(`https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&language=fr&page=1&sort_by=popularity.desc&include_adult=false&include_video=false`, function(error, response, body) {
    body = JSON.parse(body);
    res.json({result: true, movies: body.results});
  });
});
//We collect every document of the database
router.get('/mymovies', function(req, res, next) {
  MovieModel.find(
    function (err, data) {
      res.json({result:true, data})
    }
  )
});
//We add a new movie to the database
router.post('/mymovies', function(req, res, next) {
  var newMovie = new MovieModel ({
    title: req.body.title,
    overview: req.body.overview,
    poster_path: req.body.poster_path,
    idMovieDB: req.body.idMovieDB
  });
  newMovie.save(function (error, user) {
    console.log(error);
    res.json({result:true})
  });
});
//We delete a movie from the database
router.delete('/mymovies/:movieId', function(req, res, next) {
  MovieModel.deleteOne({idMovieDB: req.params.movieId},
    function(error, response) {
      res.json({result: true});
    }
  );
});

module.exports = router;
