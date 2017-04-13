'use strict'
const connection = require(__dirname + '/../db-connection.js');
var path = require('path');

///CRUD EVENT///
///-------------------------------------------------------------------------------------------
///-------------------------------------------------------------------------------------------
///-------------------------------------------------------------------------------------------
///-------------------------------------------------------------------------------------------
exports.addEvent = (req, res, next) => {
	var query = 'call addEvent(?,?,?,?)';
	const data = [
		req.body.user_id,
		req.body.event_name,
		req.body.date_start,
		req.body.date_end
	];
	console.log(data);
	var id = connection.query(
		query,
		data,
		(err, row, fields) => {
			if(!err){
				console.log(row);

				console.log("Success");
				res.status(200).send("Success");
				return row
			}
			else{
				console.log(err);
				res.status(500).send('Server error');
			}
	});
}




exports.viewEvent = (req, res, next) => {
	var query = 'select * from event where event_id = ?';
	// var query = 'call viewEvent(?)';
	const data = [
		req.params.event_id
	];
	console.log(data);
	var id = connection.query(
		query,
		data,
		(err, row, fields) => {
			if(!err){
				console.log(row);
				console.log("Success");
				res.status(200).send(row);
				//return row
			}
			else{
				console.log(err);
				res.status(500).send('Server error');
			}
	});
}

exports.viewAllEvent = (req, res, next) => {
	var query = 'select * from event;';
	// var query = 'call viewAllEvents()';
	
		var id = connection.query(
		query,
		(err, row, fields) => {
			if(!err){
				console.log(row);

				console.log("Success");
				res.status(200).send(row);
				//return row
			}
			else{
				console.log(err);
				res.status(500).send('Server error');
			}
	});
}


exports.updateEvent = (req, res, next) => {
	var query = 'call updateEvent(?,?,?,?,?)';
	const data = [
		req.body.event_id,
		req.body.event_name,
		req.body.allow_reg,
		req.body.date_start,
		req.body.date_end
	];
	console.log(data);
	var id = connection.query(
		query,
		data,
		(err, row, fields) => {
			if(!err){
				console.log(row);

				console.log("Update Event Success");
				res.status(200).send("Update Event Success");
				return row
			}
			else{
				console.log(err);
				res.status(500).send('Server error');
			}
	});
}

exports.deleteEvent = (req, res, next) => {
	console.log(1);
	var query = 'call deleteEvent(?)';
	const data = [
		req.params.event_id
	];
	console.log(data);
	var id = connection.query(
		query,
		data,
		(err, row, fields) => {
			if(!err){
				console.log(row);

				console.log("Delete Event Success");
				res.status(200).send("Delete Event Success");
				return row
			}
			else{
				console.log(err);
				res.status(500).send('Server error');
			}
	});
}



