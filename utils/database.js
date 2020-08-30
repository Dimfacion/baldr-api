var database = {};
const uri = "mongodb://localhost/baldr-db"
const mongoose = require('mongoose');

database.init = function(config, callback) {  
  callback(true);
}

module.exports = database;
