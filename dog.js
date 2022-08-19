const mongoose = require('mongoose');

const DogSchema = new mongoose.Schema({
	server: String,
	name: String
});

module.exports = mongoose.models.Dog || mongoose.model('Dog', DogSchema);