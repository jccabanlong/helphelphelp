'use strict'
const connection = require(__dirname + '/../db-connection');
var path = require('path');
///CRUDE EVENT///

var bcrypt = require('bcrypt');
const saltRounds = 10;

exports.login=(req,res)=>{

	const user = {
		username: req.body.username,
		password: req.body.password
	};

	function start(){
		const query_string = 'SELECT * from users where username = ?'
		const req_data= [user.username];
		connection.query(query_string,req_data,next_auth);
	}

	function next_auth(err, rows){
		if(!err){
	        if(!rows.length) {
				console.log('Wrong username or password...');
	            res.status(404).send({message: 'Wrong username'});
	        }else if (req.session.usertype != undefined && req.session.userid != undefined && req.session.userid != rows[0].user_id){
	        	console.log('Login session is not yet finished...');
	            return res.status(404).send({message: 'Login session is not yet finished.'});
	            //comment if we don't have authentication THIS should work
	        }
	        else if (req.session.usertype === 'pending'){
	        	console.log(req.session.usertype);
	        	return res.status(404).send({message: 'User not yet approved'});
	        } 
	        else{
	        	var hash = rows[0].password;
		   		if(bcrypt.compareSync(user.password, hash)){
		   			
		   			 if (rows[0].user_type === 'pending'){
			        	console.log(req.session.usertype);
			  
			        	return res.status(404).send({message: 'User not yet approved'});
			        	res.json({
			        		redirect: '/#!/'
			        	});
			        }
			        else{
			        	req.session.userid = rows[0].user_id
					req.session.usertype = rows[0].user_type
			        	console.log('SUCCESSFULLY LOGGED IN!');
						var json =  JSON.parse((JSON.stringify(rows[0])));
						//console.log(json);
						res.json({
						redirect: '/#!/user/home'	
						});
			        }
		   			
		   		}
		   		else{
		   			res.status(404).send({message: 'Wrong username or password.'}); 
		   		}
	        }    
		}
		else{
            return res.status(500).send(err);
		}
	}
	start();
}

exports.logout=(req,res)=>{
	if(req.session){
		req.session.destroy(function(err){
			res.json({
				redirect: '/#!/'
			});
		});
	}
}

exports.registerUser=(req,res)=>{
	const salt = bcrypt.genSaltSync(saltRounds);
	const hash = bcrypt.hashSync(req.body.password, salt);

	//automatic normal user
	const query_string = 'call createUser(?,?,?,?,?,?)';
	const req_data = [
		req.body.username,
		hash,
		'pending',
		req.body.firstname,
		req.body.lastname,
		req.body.email
	];
	
	connection.query(query_string, req_data, (err,rows)=>{
		if(!err){
			res.status(200).send(rows);
		}
		else{
			console.log(err);
			res.status(500).send(err);
		}
	});
}

exports.viewProfile = (req,res) =>{
	const query_string = 'SELECT * FROM users WHERE user_id = ?';
	const req_data = [req.session.userid]

	connection.query(query_string, req_data, (err,result)=>{
		if(!err){
			res.status(200).send(result[0]);
			console.log(result[0]);
			console.log(req.session.userid);
		}
		else{
			console.log(err);
			res.status(500).send(err);
		}
	});
}
// viewUser - views a user by ID (user_id)
exports.viewUser=(req, res)=>{

	const query_string = 'SELECT * FROM users WHERE user_id = ?';
	const req_data = [req.params.user_id]

	connection.query(query_string, req_data, (err,result)=>{
		if(!err){
			res.status(200).send(result[0]);
			//console.log(result[0]);
		}
		else{
			console.log(err);
			res.status(500).send(err);
		}
	});
}

exports.viewSponsoredEvents=(req, res)=>{

	const query_string = 'SELECT * FROM event NATURAL JOIN (SELECT * FROM sponsor NATURAL JOIN sponsor_events) A';

	connection.query(query_string, null, (err,result)=>{
		if(!err){
			res.status(200).send(result);
		}
		else{
			console.log(err);
			res.status(500).send(err);
		}
	});
}



exports.viewUserInterests = (req,res) => {
	const query_string = "SELECT * from user_interests WHERE user_id = ?";
	const req_data = [req.params.user_id]

	connection.query(query_string, req_data, (err,result)=>{
		if(!err){
			res.status(200).send(result);
		}
		else{
			console.log(err);
			res.status(500).send(err);
		}
	});
}

exports.viewUserEvents = (req,res) => {
	const query_string = "SELECT username,event_name,DATE_FORMAT(date_start,'%M %e %Y') Date FROM users NATURAL JOIN event WHERE user_id = ?";
	const req_data = [req.params.user_id]

	connection.query(query_string, req_data, (err,result)=>{
		if(!err){
			res.status(200).send(result);
			//console.log(result[0]);
		}
		else{
			console.log(err);
			res.status(500).send(err);
		}
	});
}

exports.updateInterests = (req,res) => {
	const query_string = "INSERT INTO user_interests VALUES (?,?)";
	const req_data = [req.params.user_id,req.body.interests];
	console.log(req.body.interests);
	connection.query(query_string,req_data, (err,result) => {
		if(!err){
			res.status(200).send(result);
		}
		else{
			console.log(err);
			res.status(500).send(err);
		}
	})
}

exports.deleteInterests = (req,res) => {
	const query_string = "DELETE from user_interests where user_id = ? and interests = ?";
	const req_data = [req.params.user_id,req.params.users];

	console.log(req.params.users);
	connection.query(query_string,req_data, (err,result) => {
		if(!err){
			res.status(200).send(result);
		}
		else{
			console.log(err);
			res.status(500).send(err);
		}
	})
}

//userJoinsTeam - use team_players table to add the user
exports.userJoinsTeam=(req, res)=>{

	const query_string = 'INSERT INTO team_players (team_id, user_id) VALUES (?, ?);';
	const req_data = [
		req.body.team_id,
		req.body.user_id
	];

	connection.query(query_string, req_data, (err,result)=>{
		if(!err){
			res.status(200).send(result);
		}
		else{
			console.log(err);
			res.status(500).send(err);
		}
	});	
}

// viewAllCompetitors - views all competitors (teams) in a specific game;
exports.viewAllCompetitors=(req, res)=>{
	const query_string = 'SELECT * FROM team t1, team_plays_game t2 WHERE t1.team_id = t2.team_id AND t2.game_id = ?';
	const req_data = [req.params.game_id];

	connection.query(query_string, req_data, (err,result)=>{
		if(!err){
			res.status(200).send(result);
		}
		else{
			console.log(err);
			res.status(500).send(err);
		}
	});
}

// viewCompetitor - views a specific competitor (by team_id)
exports.viewCompetitor=(req, res)=>{

	const query_string = 'SELECT * FROM team t1, team_plays_game t2 WHERE t1.team_id = ? AND t1.team_id = t2.team_id';
	const req_data = [req.params.team_id];

	connection.query(query_string, req_data, (err,result)=>{
		if(!err){
			res.status(200).send(result[0]);
		}
		else{
			console.log(err);
			res.status(500).send(err);
		}
	});
}