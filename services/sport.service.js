'use strict'
const connection = require(__dirname + '/../db-connection');
var path = require('path');

// ADDING SPORT (VALUES  'sport_name')
exports.addSport = (req,res) =>{
	var query = 'INSERT INTO sport(sport_name) VALUES(?)';
	var query1 = 'SELECT sport_id from sport WHERE sport_name = ?';
	var query2 = 'INSERT INTO event_has_sport VALUES(?,?)';
	const data = [
		req.body.sport_name
	];

	var con = connection.query(
		query,
		data,
		(err, rows) => {
			if(!err){
				console.log("Adding Sport Success");
		    	res.send('Sport Successfully added');
		    	var con1 = connection.query( query1, data, (err,rows) => {
					const data2 = [
						req.params.event_id,
						rows[0].sport_id
					];
		    		var con2 = connection.query( query2, data2, (err,rows) => {} );
		    	} );
			}
			else{
				console.log(err);
				res.status(500).send("Server Error");
			}
		}
	)   
}

// VIEWING SPORT THROUGH 'sport_id'
exports.viewSports = (req,res) =>{
	var query = 'SELECT * from sport where sport_id = ?';
	const data = [
		req.params.sport_id
	];
	var con = connection.query(
		query,
		data,
		(err, rows) =>{
			if(!err){
				console.log("Viewing Sport Success");
				res.send(rows[0]);
			}
			else{	
				console.log(err)
				res.status(500).send("Server Error")
			}
	}) 
}

// VIEWING ALL SPORTS
exports.viewAllSports = (req,res) =>{
	var query = 'SELECT * FROM sport order by sport_id';
	var con = connection.query(
		query,
		(err, rows) => {
			if(!err){
				console.log("Viewing All Sports Success");
				res.send(rows);
			}
			else{
				console.log(err);
				res.status(500).send('Server Error');
			}

	})
}

// VIEWING SPORT THROUGH 'event_event_id'
exports.viewSportsByEvent = (req,res) =>{
	var query = 'SELECT * from sport where sport_id IN (select h_sport_id from event_has_sport where h_event_id = ?) order by sport_id';
	const data = [
		req.params.event_id
	];
	var con = connection.query(
		query,
		data,
		(err, rows) =>{
			if(!err){
				console.log("Viewing Sport Success");
				res.send(rows);
			}
			else{
				console.log(err)
				res.status(500).send("Server Error")
			}
	}) 
}

// UPDATING SPORT (VALUES - 'sport_name')
exports.updateSport = (req,res) =>{
	var query = 'UPDATE sport SET sport_name = ? WHERE sport_id = ?';
	const data = [
		req.body.sport_name,
		req.body.sport_id
	];

	var con = connection.query(
		query,
		data,
		(err, rows) => {
			if(!err){
				console.log("Updating Sport Success");
				res.send("Sport Successfully Updated");
			}
			else{
				console.log(err);
				res.status(500).send("Server Error");
			}
	})
}

// DELETING SPORT THROUGH 'sport_id'
exports.deleteSport = (req,res) =>{
	var query = 'DELETE FROM sport where sport_id = ?';
	const data = [
		req.params.sport_id
	];
	var con = connection.query(
		query,
		data,
		(err, rows) =>{
			if(!err){
				console.log("Deleting Sport Success");
				res.send("Sport Successfully Deleted");
			}
			else{
				console.log(err);
				res.status(500).send("Server Error")
			}

	})
}

// DELETING ALL SPORTS
exports.deleteAllSports = (req,res) =>{
	var query = 'DELETE FROM sport';
	var con = connection.query(
		query,
		(err, rows) => {
			if(!err){
				console.log("Deleting All Sports Success");
				res.send("All Sports Successfully Deleted");
			}
			else{
				console.log(err);
				res.status(500).send("Server Error")
			}
	})
}

