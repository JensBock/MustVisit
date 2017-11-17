const User = require('../models/user');
const Location = require('../models/location');
const Picture = require('../models/picture');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
var mongoose = require('mongoose');
var multer  = require('multer');
var fs = require('fs');

var storage = multer.diskStorage({
  filename: function (req, file, cb) {
  	if(!file.originalname.match(/\.(jpg|jpeg)$/i)){
  		var err = new Error();
  		err.code = 'filetype';
  		return cb(err);
  	} else {
  		cb(null, file.originalname + '_' + Date.now())
  	}
  }
});

var upload = multer({ 
	storage: storage ,
	limits: {fileSize: 10000000}
}).single('picture');


module.exports = (router) => {


	router.post('/newPicture', (req,res) => {
		upload(req, res, function (err) {
			if (err) {
				if (err.code === 'LIMIT_FILE_SIZE'){
					res.json({success: false, message: 'fileSize is too large maximum size is 10mb'});
				} else {
					if (err.code === 'filetype'){
						res.json({success: false, message: 'filetype is invalid must be .jpg or .jpeg'});
					} else {
						console.log(err)
						 res.json({success: false, message: 'file was not able to be uploaded'});
					}
				}
				} else {
					var newImg = fs.readFileSync(req.file.path)
					
					var encImg = newImg.toString('base64');
					const picture = new Picture({
						contentType : req.file.mimetype,
						size: req.file.size,
						img: Buffer(encImg, 'base64')
					})
					picture.save();
					res.json({success: true,picture: picture , message: 'Picture is saved'});
				}
				
		});
	});

	router.get('/singlePicture/:id', (req,res) => {
		if (!req.params.id) {
			res.json({ success: false, message: 'No picture id was provided.'});
		} else {
			Picture.find({_id:req.params.id}, (err,picture) => {
				if (err) {
					res.json({ success: false, message: 'Not a valid picture id'});
				} else {
					if (!picture) {
						res.json({ success: false, message: 'Picture not found.'});
					} else {
						User.findOne({ _id: req.decoded.userId }, (err, user) => {
              				if (err) {
                				res.json({ success: false, message: err });
              				} else {
                				if (!user) {
                  					res.json({ success: false, message: 'Unable to authenticate user.' });
                				} else {
                					//var img = new Buffer(picture.img, 'base64');
									res.json({ success: true, picture: picture });
								}
							}
						});
					}
				}
			});
		}
	});

	router.post('/newLocation', (req,res) => {
		if(!req.body.title){
			res.json({success: false, message: 'Location title is required'});
		} else {
			if(!req.body.body){
				res.json({success: false, message: 'Location body is required'});
			} else {
				if(!req.body.createdBy){
					res.json({success: false, message: 'createdBy body is required'});
				} else {
					if(!req.body.picture){
						res.json({success: false, message: 'picture is required'});
					} else {
						 const location = new Location({
							title: req.body.title,
							body: req.body.body,
							lat: req.body.lat,
		    				lng: req.body.lng,
		    				tags: req.body.tags,
							createdBy: req.body.createdBy,
							picture: req.body.picture
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

	router.get('/allLocationsAndPictures', (req, res) => {
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
		})
		.populate('picture')
		.sort({'_id': -1});
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
                    location.lat = req.body.lat;
    				location.lng = req.body.lng;
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