// Asynchronous
const crypto = require('crypto').randomBytes(256).toString('hex');

module.exports = {
	//uri: 'mongodb://localhost:27017/MustVisitDb',
	uri: 'mongodb://JensBock:JensBock@ds137435.mlab.com:37435/mustvisit',
	secret: crypto,
	db: 'MustVisitDb'

}