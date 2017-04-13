'use strict'
const connection = require(__dirname + '/../db-connection.js');
var path = require('path');

exports.addSponsor = (req, res, next) => {
	var query = 'call addSponsor(?)';
	const data = [
		req.body.sponsor_name
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

exports.sponsorEvent = (req, res, next) => {
	var query = 'call sponsorEvent(?,?)';
	const data = [
		req.body.sponsor_id,
		req.body.event_id
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
exports.viewAllSponsor = (req, res, next) => {
	var query = 'call viewAllSponsors()';
	
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

exports.updateSponsor = (req, res, next) => {
	var query = 'call updateSponsor(?,?)';
	const data = [
		req.body.sponsor_id,
		req.body.sponsor_name
	];
	console.log(data);
	var id = connection.query(
		query,
		data,
		(err, row, fields) => {
			if(!err){
				console.log(row);

				console.log("Update Sponsor Success");
				res.status(200).send("Update Sponsor Success");
				return row
			}
			else{
				console.log(err);
				res.status(500).send('Server error');
			}
	});
}

exports.viewSponsor = (req, res, next) => {
	var query = 'call viewSponsor(?)';
	const data = [
		req.params.sponsor_id
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

exports.viewSponsorByEvent = (req, res, next) => {
	var query = 'call viewSponsorByEvent(?)';
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

exports.deleteSponsor = (req, res, next) => {
	console.log(1);
	var query = 'call deleteSponsor(?)';
	const data = [
		req.params.sponsor_id
	];
	console.log(data);
	var id = connection.query(
		query,
		data,
		(err, row, fields) => {
			if(!err){
				console.log(row);

				console.log("Delete Team Success");
				res.status(200).send("Delete Team Success");
				return row
			}
			else{
				console.log(err);
				res.status(500).send('Server error');
			}
	});
}