	'use strict';

const adminController =require('../services/admin.service');
const userController =require('../services/user.service');
const gameController =require('../services/game.service');
const winnerController =require('../services/winner.service');
const sportController =require('../services/sport.service');
const eventController =require('../services/event.services');
const teamController = require('../services/team.services');
const sponsorController = require('../services/sponsor.services');

// const dashboardController =require('../services/dashboard.service');
const dashboardController =require('../services/dashboard.service');



var path = require('path');
const express = require('express');
const router = express.Router();


router.get      ('/users',                  adminController.viewAllUsers);
router.get      ('/users/:user_id',         userController.viewUser);
router.put      ('/users/:user_id',         adminController.updateUserPassword);
router.delete   ('/users/:user_id',         adminController.removeUser);
router.post     ('/user_team',              userController.userJoinsTeam);
router.get      ('/logs',                   adminController.viewAllLogs);
router.get      ('/logs/:user_id',          adminController.viewLogs);


router.post('/game',                        gameController.addGame);
router.get('/game/:game_id',                gameController.viewGame);
router.get('/game',                         gameController.viewAllGames);
router.put('/game/:game_id',                gameController.updateGame);
router.delete('/game/:game_id',             gameController.deleteGame);
router.delete('/game',                      gameController.deleteAllGames);

router.get('/user/events/:user_id',         userController.viewUserEvents);
router.get('/user/sponsored/:user_id',      userController.viewSponsoredEvents);
router.get('/user/interests/:user_id',      userController.viewUserInterests);
router.put('/users/interests/:user_id',     userController.updateInterests);
router.put('/users/approval/:user_id',      adminController.approveUser);
router.put('/users/passwords/:user_id',     adminController.updateUserPassword);
router.delete('/users/interests/:user_id/:users', userController.deleteInterests);

router.delete('/users/:user_id',       adminController.removeUser);

/*-------------------------DASHBOARD------------------------*/
router.get('/viewTeamPlayGame', 			dashboardController.viewTeamPlayGame);
router.get('/viewCurrentGames', 			    dashboardController.viewCurrentGame);
// router.get('/viewUpcomingGame', 			dashboardController.viewUpcomingGame);

/*----------------------------------------------------------*/
router.post		('/login',                       userController.login);
router.get 		('/logout',                 userController.logout);
router.post 	('/users',                  userController.registerUser);


//module.exports = (router) => {
router.post     ('/events',      			eventController.addEvent);
router.get      ('/events/:event_id', 		eventController.viewEvent);
router.get      ('/events',   				eventController.viewAllEvent);
router.put      ('/events',    				eventController.updateEvent);
router.delete   ('/events/:event_id',   	eventController.deleteEvent);

router.get      ('/sponsors_get_id/:sponsor_name',	sponsorController.getSponsorId)
router.post     ('/sponsors',      sponsorController.addSponsor);
router.get      ('/sponsors/:sponsor_id', sponsorController.viewSponsor);
router.get      ('/sponsors',   sponsorController.viewAllSponsor);
router.put      ('/sponsors',    sponsorController.updateSponsor);
router.delete   ('/sponsors/:sponsor_id',    sponsorController.deleteSponsor);
router.post		('/sponsors_event',	sponsorController.sponsorEvent);
router.get 		('/sponsors_by_event/:event_id', sponsorController.viewSponsorByEvent);
router.post 	('/sponsors_from_event',	sponsorController.deleteSponsorFromEvent)

router.post     ('/teams',      	teamController.addTeam);
router.get      ('/teams/:team_id', teamController.viewTeam);
router.get      ('/teams',  	    teamController.viewAllTeam);
router.put      ('/teams',          teamController.updateTeam);
router.delete   ('/teams/:team_id', teamController.deleteTeam);
router.post		('/teams/join',	    teamController.userJoinTeam);
router.get      ('/teams_get_id/:team_name',			teamController.getTeamId);
router.post		('/teams/event',	teamController.teamJoinEvent);
router.get       ('/teams_per/:event_id', teamController.viewTeamPerEvent);

router.post		('/sports', 				sportController.addSport);
router.get 		('/sports/:sport_id', 		sportController.viewSports);
router.get 		('/sports', 				sportController.viewAllSports);
router.put 		('/sport', 					sportController.updateSport);
router.delete 	('/sport/:sport_id', 		sportController.deleteSport);
router.delete 	('/sports', 				sportController.deleteAllSports);

router.get      ('/sponsors_get_id/:sponsor_name',	sponsorController.getSponsorId)
router.post     ('/sponsors',      sponsorController.addSponsor);
router.get      ('/sponsors/:sponsor_id', sponsorController.viewSponsor);
router.get      ('/sponsors',   sponsorController.viewAllSponsor);
router.put      ('/sponsors',    sponsorController.updateSponsor);
router.delete   ('/sponsors/:sponsor_id',    sponsorController.deleteSponsor);
router.post		('/sponsors_event',	sponsorController.sponsorEvent);
router.get 		('/sponsors_by_event/:event_id', sponsorController.viewSponsorByEvent);
router.post 	('/sponsors_from_event',	sponsorController.deleteSponsorFromEvent)

router.post('/competitors',               adminController.addCompetitor);
router.get('/competitors/:game_id',  userController.viewAllCompetitors); 
router.get('/competitors/:team_id',      userController.viewCompetitor);
router.put('/competitors/:team_id',    adminController.updateCompetitor);
router.delete('/competitors/:team_id', adminController.deleteCompetitor);

router.post('/game', 						gameController.addGame);
router.get('/game/:game_id',				gameController.viewGame);
router.get('/game', 						gameController.viewAllGames);
router.put('/game/:game_id', 				gameController.updateGame);
router.delete('/game/:game_id', 			gameController.deleteGame);
router.delete('/game', 						gameController.deleteAllGames);

router.post('/sport/:event_id',				sportController.addSport);
router.get('/sport/:sport_id',				sportController.viewSports);
router.get('/sport', 						sportController.viewAllSports);
router.put('/sport', 						sportController.updateSport);
router.delete('/sport/:sport_id', 			sportController.deleteSport);
router.delete('/sport', 					sportController.deleteAllSports);

router.post('/winner', 						winnerController.addWinner);
router.get('/winner/:game_id',				winnerController.viewWinner);
router.get('/winner', 						winnerController.viewAllWinners);
router.put('/winner/:game_id', 				winnerController.updateWinner);
router.delete('/winner/:game_id', 			winnerController.deleteWinner);
router.delete('/winner', 					winnerController.deleteAllWinners);

//additional
router.post('/ranking/:sport_id', 					gameController.getRanking);
router.post('/bet/:user_id', 						gameController.bet);
router.get('/bet/:user_id/:game_id', 						gameController.betStatus);
router.get('/scores/:game_id/:team_id', 						gameController.getScores);
router.get('/sport/event/:event_id', 		sportController.viewSportsByEvent);
router.post('/game/sport/:sport_id', 		gameController.viewGamesBySport);
router.get('/schedule/:sport_id', 		gameController.viewScheds);
router.get('/leaderboard/:sport_id', 		gameController.viewLeaderboards);



router.get('/user_loggedin', (req, res) => {
	if (req.session)
		res.send(req.session.userid);
	else
		res.send({});
});

router.get('/user_type_loggedin', (req, res) => {
    if (req.session)
        res.send(req.session.usertype);
    else
        res.send({});
});

router.get('/', (req,res)=>{
	res.sendFile('views/index.html',{root:__dirname+'/..'});
});

router.get('/403', (req,res)=>{
    res.sendFile('public/layouts/forbidden.html',{root:__dirname+'/..'});
});

router.all('*', (req, res) => {
    res.status(404).send({message : 'Unmatched route. =(('});
});

module.exports = router;
