var database = {};
const uri = "mongodb://localhost/baldr-db"
const mongoose = require('mongoose');

database.init = function(config, callback) {
  mongoose.connect(uri, {
    useNewUrlParser: true
  });
  const db = mongoose.connection;
  db.on('error', function() {
    console.log("Error while connecting to database")
    callback(false);
  });
  db.once('open', function() {
    // we're connected!
    console.log("Connected to database")
    callback(true);
  });
}

module.exports = database;
