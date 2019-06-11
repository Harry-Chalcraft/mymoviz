var mongoose = require('mongoose');

var user = //insert your userID;
var password = //insert your DB password;
var port = //DB port;
var bddname = //name of your DB;

var options = { connectTimeoutMS: 5000, useNewUrlParser: true }

mongoose.connect(
  "mongodb://"+user+":"+password+"@ds2"+port+".mlab.com:"+port+"/"+bddname,
  options,
  function(error){
    console.log(error);
  }
);
