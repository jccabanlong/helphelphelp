'use strict'
const connection = require(__dirname + '/../db-connection');
var path = require('path');
var logQuery = 'INSERT INTO logs(user_id,log_timestamp,message) VALUES(?,curdate(),?);';

exports.addGame = (req,res) =>{
	var query = 'INSERT INTO game(sport_id,referee,winner_team_id) VALUES(?,?,?)';
	const data = [
		req.body.sport_id,
		req.body.referee,
		req.body.winner_team_id
	];
	console.log(data);
	var id = connection.query(
		query,
		data,
		(err, rows) => {
			if(!err){
				console.log("Adding Game Success");
		    	res.send('Game Successfully added');
				connection.query(logQuery, [null,'Added Game # '], (err,rows) => {})
			}
			else{
				console.log(err);
				res.status(500).send('Server Error');
			}
	})
}

exports.viewGame = (req,res) =>{
	var query = 'SELECT * FROM game WHERE game_id = ?';
	const data = [
		req.params.game_id
	];
	console.log(data);
	var id = connection.query(
		query,
		[req.params.game_id],
		(err, rows) => {
			if(!err){
				console.log("Viewing Game Success");
				res.send(rows[0]);
				connection.query(logQuery, [null,'Viewed Game # '], (err,rows) => {})
			}
			else{
				console.log(err);
				res.send('Server Error');
			}
	})
}

exports.viewAllGames = (req,res) =>{
	var query = 'SELECT * FROM game';
	var id = connection.query(
		query,
		(err, rows) => {
			if(!err){
				console.log("Viewing All Games Success");
				res.send(rows);
				connection.query(logQuery, [null,'Viewed All Games'], (err,rows) => {})
			}
			else{
				console.log(err);
				res.send('Server Error');
			}
	})
}

exports.updateGame = (req,res) =>{
	var query = 'UPDATE game SET sport_id = ?,referee = ? WHERE game_id = ?';
	const data = [
		req.body.sport_id,
		req.body.referee,
		req.params.game_id
	];
	var id = connection.query(
		query,
		data,
		(err, rows) => {
			if(!err){
				console.log("Updating Game Success");
				res.send("Game Successfully Updated");
				connection.query(logQuery, [null,'Updated Game # '], (err,rows) => {})
			}
			else{
				console.log(err);
				res.status(500).send('Server Error');
			}
	})
}

exports.deleteGame = (req,res) =>{
	var query = 'DELETE FROM game WHERE game_id = ?';
	const data = [
		req.params.game_id
	];
	var id = connection.query(
		query,
		data,
		(err, rows) => {
			if(!err){
				console.log("Deleting Game Success");
				res.send("Game Successfully Deleted");
				connection.query(logQuery, [null,'Deleted Game # '], (err,rows) => {})
			}
			else{
				console.log(err);
				res.status(500).send('Server Error');
			}
	})
}

exports.deleteAllGames = (req,res) =>{
	var query = 'DELETE FROM game';
	var id = connection.query(
		query,
		(err, rows) => {
			if(!err){
				console.log("Deleting All Games Success");
				res.send("All Games Successfully Deleted");
				connection.query(logQuery, [null,'Deleted All Games'], (err,rows) => {})
			}
			else{
				console.log(err);
				res.status(500).send('Server Error');
			}
	})
}
