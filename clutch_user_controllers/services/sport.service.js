'use strict'
const connection = require(__dirname + '/../db-connection');
var path = require('path');
var logQuery = 'INSERT INTO logs(user_id,log_timestamp,message) VALUES(?,curdate(),?);';

exports.addSport = (req,res) =>{
	var query = 'INSERT INTO sport(sport_name) VALUES(?)';
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
		    	connection.query(logQuery, [null,'Added Sport # '], (err,rows) => {})
			}
			else{
				console.log(err);
				res.status(500).send("Server Error");
			}
	})
}

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
				connection.query(logQuery, [null,'Viewed Sport # '], (err,rows) => {})
			}
			else{
				console.log(err)
				res.status(500).send("Server Error")
			}
	}) 
}

exports.viewAllSports = (req,res) =>{
	var query = 'SELECT * FROM sport';
	var con = connection.query(
		query,
		(err, rows) => {
			if(!err){
				console.log("Viewing All Sports Success");
				res.send(rows);
				connection.query(logQuery, [null,'Viewed All Sports '], (err,rows) => {})
			}
			else{
				console.log(err);
				res.status(500).send('Server Error');
			}

	})
}

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
				connection.query(logQuery, [null,'Updated Sport # '], (err,rows) => {})
			}
			else{
				console.log(err);
				res.status(500).send("Server Error");
			}
	})
}

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
				connection.query(logQuery, [null,'Deleted Sport # '], (err,rows) => {})
			}
			else{
				console.log(err);
				res.status(500).send("Server Error")
			}

	})
}

exports.deleteAllSports = (req,res) =>{
	var query = 'DELETE FROM sport';
	var con = connection.query(
		query,
		(err, rows) => {
			if(!err){
				console.log("Deleting All Sports Success");
				res.send("All Sports Successfully Deleted");
				connection.query(logQuery, [null,'Deleted All Sports '], (err,rows) => {})
			}
			else{
				console.log(err);
				res.status(500).send("Server Error")
			}
	})
}

