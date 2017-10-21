const User = require('../models/user');
const Location = require('../models/location');
const jwt = require('jsonwebtoken');
const config = require('../config/database')

module.exports = (router) => {

	router.post('/newLocation', (req,res) => {
		if(!req.body.title){
			res.json({success: false, message: 'Location title is required'})
		} else {
			if(!req.body.body){
				res.json({success: false, message: 'Location body is required'})
			} else {
				if(!req.body.createdBy){
					res.json({success: false, message: 'createdBy body is required'})
				} else {
					const location = new Location({
						title: req.body.title,
						body: req.body.body,
						createdBy: req.body.createdBy
					});
					location.save((err) => {
						if(err) {
							if (err.errors){
								if (err.errors.title) {
									res.json({success: false, message: err.errors.title.message });
								} else {
									if (err.errors.body) {
									res.json({success: false, message: err.errors.body.message });
									} else {
									res.json({success: false, message: err.errors.createdBy.message });
									}
								}
							} else {
								res.json({success: false, message: err });
							}
						} else {
							res.json({success: true, message: 'Location is saved'});
						}
					});
				}
			}
		}
	});

return router
}