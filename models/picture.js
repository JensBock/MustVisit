const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;

const pictureSchema = new Schema({
	contentType: {type: String},
	size: {type: Number},
 	img: { type: Buffer }
});

module.exports = mongoose.model('Picture', pictureSchema);