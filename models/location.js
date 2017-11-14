const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;

let titleLengthChecker = (title) => {
	if(!title){
		return false;
	} else {
		if (title.length < 5 || title.length > 50){
			return false;
		} else {
			return true;
		}
	}
};

let alphaNumericTitleChecker = (title) => {
	if(!title){
		return false;
	} else {
		const regExp = new RegExp(/^[a-zA-Z0-9 ]+$/);
		return regExp.test(title);
	}
};

const titleValidator = [
	{
		validator: titleLengthChecker, 
		message: 'Title must be at least 5 characters but no more than 50.'
	},
	{
		validator: alphaNumericTitleChecker, 
		message: 'Must be a valid title.'
	}
];

let bodyLengthChecker = (body) => {
	if (!body) {
		return false;
	} else {
		if (body.length < 5 || body.length > 500) {
			return false;
		} else {
			return true;
		}
	}
}

const bodyValidator = [
	{
		validator: bodyLengthChecker, 
		message: 'Body must be at least 5 characters but no more than 500.'
	}
];

const locationSchema = new Schema({
title: {type: String, required: true , validate: titleValidator},
body: {type: String, required: true , validate: bodyValidator},
lat: {type: Number},
lng: {type: Number},
tags: {type: Array},
createdBy: {type: String, required: true},
createdAt: {type: Date, default: Date.now()},
picture: { type: Schema.Types.ObjectId, ref: 'Picture' }
});

module.exports = mongoose.model('Location', locationSchema);