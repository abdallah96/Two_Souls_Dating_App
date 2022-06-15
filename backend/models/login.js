var mongoose = require('mongoose');

var credentials = new mongoose.Schema({
    username: String,
    password: String,

});

module.exports = new mongoose.model('login', credentials);