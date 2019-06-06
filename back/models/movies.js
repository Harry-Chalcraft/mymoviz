var mongoose = require('mongoose');

var MovieSchema = mongoose.Schema({
  title: String,
  overview: String,
  poster_path: String,
  idMovieDB: Number
});

module.exports = mongoose.model('movies', MovieSchema);
