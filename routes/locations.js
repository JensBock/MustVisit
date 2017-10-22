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

	router.get('/allLocations', (req, res) => {
		Location.find({}, (err,locations) => {
			if (err) {
				res.json({ success: false, message: err});
			} else {
				if (!locations) {
					res.json({ success: false, message: 'No locations found.'});
				} else {
					res.json({ success: true, locations: locations});
				}

			}
		}).sort({'_id': -1});
	});

	router.get('/singleLocation/:id', (req,res) => {
		if (!req.params.id) {
			res.json({ success: false, message: 'No location id was provided.'});
		} else {
			Location.find({_id:req.params.id}, (err,location) => {
				if (err) {
					res.json({ success: false, message: 'Not a valid location id'});
				} else {
					if (!location) {
						res.json({ success: false, message: 'Location not found.'});
					} else {
						User.findOne({ _id: req.decoded.userId }, (err, user) => {
              				if (err) {
                				res.json({ success: false, message: err });
              				} else {
                				if (!user) {
                  					res.json({ success: false, message: 'Unable to authenticate user.' });
                				} else {
										res.json({ success: true, location: location});
								}
							}
						});
					}
				}
			});
		}
	});

	router.put('/updateLocation', (req, res) => {
    if (!req.body._id) {
      res.json({ success: false, message: 'No location id provided' });
    } else {
      Location.findOne({ _id: req.body._id }, (err, location) => {
        if (err) {
          res.json({ success: false, message: 'Not a valid location id' });
        } else {
          if (!location) {
            res.json({ success: false, message: 'location id was not found.' });
          } else {
            User.findOne({ _id: req.decoded.userId }, (err, user) => {
              if (err) {
                res.json({ success: false, message: err });
              } else {
                if (!user) {
                  res.json({ success: false, message: 'Unable to authenticate user.' });
                } else {
                    location.title = req.body.title;
                    location.body = req.body.body; //
                    location.save((err) => {
                      if (err) {
                        if (err.errors) {
                          res.json({ success: false, message: 'Please ensure form is filled out properly' });
                        } else {
                          res.json({ success: false, message: err });
                        }
                      } else {
                        res.json({ success: true, message: 'location Updated!' });
                      }
                    });
                }
              }
            });
          }
        }
      });
    }
  });

router.delete('/deleteLocation/:id', (req,res) => {
	if (!req.params.id) {
		res.json({ success: false, message: 'No location id was provided.'});
	} else {
		Location.findOne({_id:req.params.id}, (err,location) => {
			if (err) {
				res.json({ success: false, message: 'Not a valid location id'});
			} else {
				if (!location) {
					res.json({ success: false, message: 'Location not found.'});
				} else {
					User.findOne({ _id: req.decoded.userId }, (err, user) => {
              			if (err) {
                			res.json({ success: false, message: err });
              			} else {
                			if (!user) {
                  				res.json({ success: false, message: 'Unable to authenticate user.' });
                			} else {
                				location.remove((err) => {
                					if (err) {
										res.json({ success: false, message: err });
                					} else {
										res.json({ success: true, location: 'Location deleted'});
                					}
                				});
							}
						}
					});
				}
			}
		});
	}
});

return router
}