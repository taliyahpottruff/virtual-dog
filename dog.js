const mongoose = require('mongoose');

const DogSchema = new mongoose.Schema({
	server: String,
	name: String,
	vitals: {
		dead: { type: Boolean, default: false },
		hunger: { type: Number, default: 100 }
	}
});

module.exports = mongoose.models.Dog || mongoose.model('Dog', DogSchema);