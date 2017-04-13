'use strict'
const connection = require(__dirname + '/../db-connection');
var path = require('path');

exports.viewCurrentGame =  (req,res) => {
	const query_string = "SELECT venue_name, sport_name,game_id,DATE_FORMAT(date_start,'%M %e %Y') Date from game natural join sport natural join venue WHERE DATEDIFF(NOW(),date_start) = 0";
	//select current game on current event
	connection.query(query_string,null,(err,rows) =>{
		if(!err){
			res.status(200).send(rows);
		}
		else{
			res.status(500).send(err);
		}
	})
}
exports.viewUpcomingGame = (req,res) => {
	const query_string = "SELECT venue_name, sport_name,game_id,DATE_FORMAT(date_start,'%M %e %Y') Date from game natural join sport natural join venue WHERE DATEDIFF(date_start,NOW()) < 3 AND DATEDIFF(NOW(),date_start) != 0 ORDER BY Date ASC";
	//Check the next games in reference with the current game. e.g. If today is monday, select games on Tuesday
	connection.query(query_string,null,(err,rows) =>{
		if(!err){
			res.status(200).send(rows);
		}
		else{
			res.status(500).send(err);
		}
	})

}

exports.viewTeamPlayGame = (req,res) => {

	const query_string = "SELECT * FROM team NATURAL JOIN team_plays_game ORDER BY score DESC";


	connection.query(query_string,null,(err,rows) =>{
		if(!err){
			res.status(200).send(rows);
		}
		else{
			res.status(500).send(err);
		}
	})
}