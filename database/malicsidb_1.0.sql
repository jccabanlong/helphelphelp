/*
CMSC 128 MalICSi Database

Go to directory where malicsidb.sql is located or enter full path to file then run:
	mysql -u root -p < malicsidb.sql

*/
DROP USER "projectOneTwoEight"@"localhost";

CREATE USER "projectOneTwoEight"@"localhost" IDENTIFIED BY "password";

GRANT ALL PRIVILEGES ON malicsiDB.* TO "projectOneTwoEight"@"localhost" WITH GRANT OPTION;

DROP DATABASE IF EXISTS `malicsiDB`;

CREATE DATABASE IF NOT EXISTS `malicsiDB`;

USE `malicsiDB`;

create table users(
	user_id 		int unsigned auto_increment,
	username 		varchar(50) not null,
	password 		varchar(50) not null,
	user_type 		enum('admin','normal'),
	firstname 		varchar(50) not null,
	lastname 		varchar(50) not null,
	college 		varchar(50),
	contactno 		varchar(50),
	email 			varchar(100),
	weight 			int,
	height 			int,

	UNIQUE 			(username),
	constraint 		user_id_pk primary key(user_id)
);

create table user_interests(
	user_id 		int unsigned,
	interests 		text,
	constraint 		user_interests_fk foreign key(user_id) references users(user_id) ON DELETE CASCADE ON UPDATE CASCADE
);

create table logs(
	log_id 			int unsigned auto_increment,
	user_id 		int unsigned,
	log_timestamp 	timestamp default now(),
	message 		text,
	constraint 		log_id_pk primary key(log_id)
);

create table event(
	event_id 		int unsigned auto_increment,
	user_id 		int unsigned,
	event_name 		varchar(100) not null,
	allow_reg 		boolean not null default FALSE,
	date_start 		date,
	date_end 		date,
	duration 		int,

	UNIQUE			(event_name),
	constraint 		event_id_pk primary key(event_id),
	constraint 		event_user_id_fk foreign key(user_id) references users(user_id) ON DELETE CASCADE ON UPDATE CASCADE
);

create table team(
	team_id 		int unsigned auto_increment,
	team_name 		varchar(100) not null,

	UNIQUE			(team_name),
	constraint 		team_id_pk primary key(team_id)
);

create table team_players(
	team_id 		int unsigned,
	user_id 		int unsigned,
	constraint 		team_id_fk foreign key(team_id) references team(team_id) ON DELETE CASCADE ON UPDATE CASCADE,
	constraint 		user_id_fk foreign key(user_id) references users(user_id) ON DELETE CASCADE ON UPDATE CASCADE
);

create table team_joins_event(
	event_id 		int unsigned,
	team_id 		int unsigned,
	constraint 		event_id_pk primary key(event_id),
	constraint 		team_id_joins_event_fk foreign key(team_id) references team(team_id) ON DELETE CASCADE ON UPDATE CASCADE,
	constraint 		team_joins_event_id_fk foreign key(event_id) references event(event_id) ON DELETE CASCADE ON UPDATE CASCADE
);

create table sport(
	sport_id 		int unsigned auto_increment,
	event_event_id	int unsigned,
	sport_name		varchar(100),

	UNIQUE			(sport_name),
	constraint		event_event_id foreign key(event_event_id) references event(event_id) ON DELETE CASCADE ON UPDATE CASCADE,
	constraint		sport_id_pk primary key(sport_id)
);

create table venue(
	venue_id 		int unsigned auto_increment,
	latitude 		float,
	longitude		float,
	address 		varchar(150),
	venue_name 		varchar(100),

	UNIQUE			(venue_name),
	constraint 		venue_id_pk primary key(venue_id)
);


create table game(
	game_id 		int unsigned auto_increment,
	sport_id 		int unsigned,
	venue_id 		int unsigned,
	date_start		datetime,
	duration		int,
	winner_team_id	int unsigned default NULL,
	referee 		varchar(100),
	constraint 		venue_id foreign key(venue_id) references venue(venue_id) ON DELETE CASCADE ON UPDATE CASCADE,
	constraint 		game_id_pk primary key(game_id)
);

create table team_plays_game(
	game_id 		int unsigned,
	team_id 		int unsigned,
	score 			int,
	bet_count 		int,
	constraint 		team_plays_game_id_fk foreign key(game_id) references game(game_id) ON DELETE CASCADE ON UPDATE CASCADE,
	constraint 		team_id_plays_game_fk foreign key(team_id) references team(team_id) ON DELETE CASCADE ON UPDATE CASCADE

);

create table sponsor(
	sponsor_id 		int unsigned auto_increment,
	sponsor_name 	varchar(100),
	constraint 		sponsor_id_pk primary key(sponsor_id)
);

create table sponsor_events(
	sponsor_id 		int unsigned,
	event_id 		int unsigned,
	constraint 		sponsor_id_fk foreign key(sponsor_id) references sponsor(sponsor_id) ON DELETE CASCADE ON UPDATE CASCADE,
	constraint 		event_id_fk foreign key(event_id) references event(event_id) ON DELETE CASCADE ON UPDATE CASCADE
);



DELIMITER %%
	CREATE TRIGGER userInsert AFTER INSERT ON users
		FOR EACH ROW
			BEGIN
				INSERT INTO logs(user_id, message) VALUES(NEW.user_id, concat("Created new user with user name: ", NEW.username));
			END;
%%
	CREATE TRIGGER userDelete AFTER DELETE ON users
		FOR EACH ROW
			BEGIN
				INSERT INTO logs(user_id, message) VALUES(OLD.user_id, concat("Deleted user: ", OLD.username));
			END;
%%
--PROCEDURES--
	--CRUD FOR SPORTS
	CREATE PROCEDURE sportInsert(in userid int unsigned, in eventid int unsigned, in sportname varchar(100))
		BEGIN
			INSERT INTO sport(event_event_id, sport_name) VALUES(eventid, sportname);
			INSERT INTO logs(user_id, message) VALUES(userid, concat((select username from users where user_id = userid), " added new Sport"));
		END;
%%

	CREATE PROCEDURE sportDelete(in userid int unsigned, in sportid int unsigned)
		BEGIN
			INSERT INTO logs(user_id, message) VALUES(userid, concat((select username from users where user_id = userid), " delete sport ", (select sport_name from sport where sport_id = sportid)));
			DELETE FROM sport where sport_id = sportid;
		END;
%%

	CREATE PROCEDURE sportUpdate(in userid int unsigned, in sportid int unsigned, in newSportName varchar(100))
		BEGIN
			INSERT INTO logs(user_id, message) VALUES(userid, concat((select username from users where user_id = userid), " updated", (select sport_name from sport where sport_id = sportid)," sport"));
			UPDATE sport SET sport_name = newSportName where sport_id = sportid;
		END;
%%

	CREATE PROCEDURE userViewAllSports(in userid int)
		BEGIN
			SELECT * from sport;
			INSERT INTO logs(user_id, message) VALUES(userid, concat((select username from users where user_id = userid)," viewed all sports"));
		END;
%%

	CREATE PROCEDURE useViewSport(in userid int, in sportname varchar(100))
		BEGIN
			SELECT * FROM sport where sport_name = sportname;
			INSERT INTO logs(user_id, message) VALUES(userid, concat((select username from users where user_id = userid)," viewed sport ", sportname));
		END;
%%
	--CRUD FOR GAMES--
	CREATE PROCEDURE addGame(in userid int unsigned, in sportid int unsigned, in venueid int unsigned, in datestart datetime, in durationIn int,in ref varchar(100))
		BEGIN
			INSERT INTO game(sport_id, venue_id, date_start, duration, referee) VALUES(sportid, venueid, datestart, durationIn, ref);
			INSERT INTO logs(user_id, message) VALUES(userid, concat((select username from users where user_id = userid), " added new game"));
		END;
%%

	CREATE PROCEDURE deleteGame(in userid int unsigned, in gameid int unsigned)
		BEGIN
			INSERT INTO logs(user_id, message) VALUES(userid, concat((select username from users where user_id = userid), " delete a sport"));
			DELETE FROM game where game_id = gameid;
		END;
%%

	CREATE PROCEDURE updateGame(in userid int unsigned, in gameid int unsigned, in newVenue int unsigned, in newSportId int unsigned, in newDateStart datetime, in newDuration int)
		BEGIN
			INSERT INTO logs(user_id, message) VALUES(userid, concat((select username from users where user_id = userid), " updated a game"));
			UPDATE game SET sport_id = newSportId, venue_id = newVenue, date_start = newDateStart, duration = newDuration where game_id = gameid;
		END;
%%
	CREATE PROCEDURE userViewAllGames(in userid int unsigned)
		BEGIN
			SELECT * FROM game;
			INSERT INTO logs(user_id, message) VALUES(userid, concat((select username from users where user_id = userid), " viewed all games"));
		END;
%%
	CREATE PROCEDURE selectTeamId(in id int unsigned)
		BEGIN
			SELECT team_id FROM team_plays_game WHERE game_id = id;
		END;
%%
	CREATE PROCEDURE userViewGame(in userid int unsigned, in gameid int unsigned)
		BEGIN
			SELECT A.team_name, B.team_name FROM team A, team B WHERE A.team_id IN (SELECT team_id FROM team_plays_game WHERE game_id = gameid) AND B.team_id IN (SELECT team_id FROM team_plays_game WHERE game_id = gameid) AND A.team_id != B.team_id LIMIT 1;
			INSERT INTO logs(user_id, message) VALUES(userid, concat((select username from users where user_id = userid)," viewed game with id: ", gameid));
		END;
%%
	--Winner ADD--
	CREATE PROCEDURE addWinner(in userid int unsigned, in gameid int unsigned, in winnerid int unsigned)
		BEGIN
			UPDATE game SET winner_team_id = winnerid where game_id = gameid;
			INSERT INTO logs(user_id, message) VALUES(userid, concat((select username from users where user_id = userid), " set ",(select team_name from team where team_id = winnerid), " as winner of game ", gameid));
		END;
%%

	CREATE PROCEDURE userViewAllWinners(in userid int unsigned)
		BEGIN
			SELECT A.winner_team_id, B.team_name from game as A JOIN team as B on (B.team_id = A.winner_team_id);
			INSERT INTO logs(user_id, message) VALUES(userid, concat((select username from users where user_id = userid), " viewed all winners"));
		END;
%%

	CREATE PROCEDURE userViewWinnerInGame(in userid int unsigned, in gameid int unsigned)
		BEGIN
			SELECT A.winner_team_id, B.team_name from game as A JOIN team as B on A.game_id = gameid and (B.team_id = A.winner_team_id);
			INSERT INTO logs(user_id, message) VALUES(userid, concat((select username from users where user_id = userid)," viewed winner of game(id): ", gameid));
		END;
%%
	--CRUD FOR EVENT
	CREATE PROCEDURE addEvent(in userid int unsigned, in eventName varchar(100), in dateStart date, in dateEnd date)
		BEGIN
			INSERT INTO logs(user_id, message) VALUES(userid, concat((select username from users where user_id = userid), " added new Event"));
			INSERT INTO event(user_id, event_name, date_start, date_end, duration ) VALUES(userid, eventName, dateStart, dateEnd, datediff(dateEnd, dateStart));
		END;
%%
	CREATE PROCEDURE viewEvent(in userid int unsigned, in eventName varchar(100))
		BEGIN
			INSERT INTO logs(user_id, message) VALUES(userid, concat((select username from users where user_id = userid), " viewed ", eventName, " event"));
			SELECT * FROM event where event_name = eventName;
		END;
%%
	CREATE PROCEDURE viewAllEvents(in userid int unsigned)
		BEGIN
			INSERT INTO logs(user_id, message) VALUES(userid, concat((select username from users where user_id = userid), " viewed all events"));
			SELECT * FROM event;
		END;
%%
	CREATE PROCEDURE updateEvent(in userid int unsigned, in eventId int unsigned, in eventName varchar(100), in allowReg boolean, in dateSart date, in dateEnd date)
		BEGIN
			INSERT INTO logs(user_id, message) VALUES(userid, concat((select username from users where user_id = userid), "updated event ", (select event_name from event where event_id = eventId)));
			UPDATE event SET event_name = eventName, allow_reg = allowReg, date_start = dateStart, date_end = dateEnd, duration = datediff(dateEnd,dateStart) where event_id = eventId;
		END;
%%
	CREATE PROCEDURE deleteEvent(in userid int unsigned, in eventId int unsigned)
		BEGIN
			INSERT INTO logs(user_id, message) VALUES( userid, concat((select username from users where user_id = userid)," delete event ", (select event_name from event where event_id = eventId)));
			DELETE FROM event where event_id = eventId;
		END;
%%
	--CRUD FOR TEAM
	CREATE PROCEDURE addTeam(in userid int unsigned, in teamName varchar(100))
		BEGIN
			INSERT INTO logs(user_id, message) VALUES(userid,concat((select username from users where user_id = userid), " added team ", teamName));
			INSERT INTO team(team_name) VALUES(teamName);
		END;
%%
	CREATE PROCEDURE userJoinsTeam(in userid int unsigned, in teamName varchar(100))
		BEGIN
			INSERT INTO logs(user_id, message) VALUES(userid, concat((select username from users where user_id = userid), " joined team ", teamName));
			INSERT INTO team_players(team_id, user_id) values((select team_id from team where team_name = teamName), userid);
		END;
%%
	CREATE PROCEDURE viewTeam(in userid int unsigned, in teamName varchar(100))
		BEGIN
			INSERT INTO logs(user_id, message) VALUES(userid, concat((select username from users where user_id = userid), " viewed ", teamName, " team"));
			SELECT A.team_name, B.username from team as A JOIN users as B JOIN team_players as C on (A.team_name = teamName) and (C.team_id = A.team_id) and (C.user_id = B.user_id);
		END;
%%
	CREATE PROCEDURE viewAllTeam(in userid int unsigned)
		BEGIN
			INSERT INTO logs(user_id, message) VALUES(userid, concat((select username from users where user_id = userid), " viewed all teams"));
			SELECT * from team;
		END;
%%
	CREATE PROCEDURE updateTeam(in userid int unsigned, in teamId int unsigned, in teamName varchar(100))
		BEGIN
			INSERT INTO logs(user_id, message) VALUES (userid, concat((select username from users where user_id = userid), " updated team ", (select team_name from team where team_id = teamId)));
			UPDATE team SET team_name = teamName where team_id = teamId;
		END;
%%
	CREATE PROCEDURE deleteTeam(in userid int unsigned, in teamId int unsigned)
		BEGIN
			INSERT INTO logs(user_id, message) VALUES(userid, concat((select username from users where user_id = userid), " deleted team ", (select team_name from team where team_id = teamId)));
			DELETE FROM team where team_id = teamId;

		END;
%%
	CREATE PROCEDURE teamJoinEvent(in userid int unsigned, in teamId int unsigned, in eventId int unsigned)
		BEGIN
			INSERT INTO logs(user_id, message) VALUES(userid, concat((select username from users where user_id = userid), " team ", (select team_name from team where team_id = teamId), " joined event ", (select event_name from event where event_id = eventId)));
			INSERT INTO team_joins_event(event_id,team_id) VALUES(eventId,teamId);
		END;
%%
	CREATE PROCEDURE teamPlayGame(in userid int unsigned, in teamId int unsigned, in gameId int unsigned)
		BEGIN
			INSERT INTO logs(user_id, message) VALUES(userid, concat((select username from users where user_id = userid), " team ", (select team_name from team where team_id = teamId), " played in game ", gameId));
			INSERT INTO team_plays_game(game_id,team_id,score,bet_count) values(gameId,teamId,0,0);
		END;
%%
	--CRUD FOR SPONSORS
	CREATE PROCEDURE addSponsor(in userid int unsigned, in sponsorName varchar(100))
		BEGIN
			INSERT INTO logs(user_id, message) VALUES(userid, concat((select username from users where user_id = userid), " added sponsor"));
			INSERT INTO sponsor(sponsor_name) VALUES(sponsorName);
		END;
%%
	CREATE PROCEDURE sponsorEvent(in userid int unsigned, in sponsorId int unsigned, in eventId int unsigned)
		BEGIN
			INSERT INTO logs(user_id, message) 	VALUES(userid, concat((select sponsor_name from sponsor where sponsor_id = sponsorId), " sponsored event ", (select event_name from event where event_id = eventId)));
			INSERT INTO sponsor_events(sponsor_id, event_id) VALUES(sponsorId, eventId);
		END;
%%
	CREATE PROCEDURE viewAllSponsor(in userid int unsigned)
		BEGIN
			INSERT INTO logs(user_id, message) VALUES(userid, concat((select username from users where user_id = userid), " viewed all sponsors"));
			SELECT * FROM sponsor;
		END;
%%
	CREATE PROCEDURE viewSponsorByEvent(in userid int unsigned, in eventId int unsigned)
		BEGIN
			INSERT INTO logs(user_id, message) VALUES(userid, concat((select username from users where user_id = userid), " viewed sponsor ", (select event_name from event where event_id = eventId)));
			SELECT A.event_name, B.sponsor_name from event as A JOIN sponsor as B JOIN sponsor_events as C on (A.event_id = eventId) and (A.event_id = C.event_id) and (B.sponsor_id = C.sponsor_id);
		END;
%%
	CREATE PROCEDURE viewSponsor(in userid int unsigned, in sponsorId int unsigned)
		BEGIN
			INSERT INTO logs(user_id, message) VALUES(userid, concat((select username from users where user_id = userid), " viewed sponsors of event ", (select sponsor_name from sponsor where sponsor_id = sponsorId)));
			SELECT A.sponsor_name, B.event_name from sponsor as A JOIN event as B JOIN sponsor_events as C on (A.sponsor_id = sponsorId) and (A.sponsor_id = C.sponsor_id) and (B.event_id = C.event_id);
		END;
%%
	CREATE PROCEDURE updateSponsor(in userid int unsigned, in sponsorId int unsigned, in sponsorName varchar(100))
		BEGIN
			INSERT INTO logs(user_id, message) 	VALUES(userid, concat((select username from users where user_id = userid), " updated sponsor ", (select sponsor_name from sponsor where sponsor_id = sponsorId)));
			UPDATE sponsor SET sponsor_name = sponsorName where sponsor_id = sponsorId;
		END;
%%
	CREATE PROCEDURE deleteSponsor(in userid int unsigned, in sponsorId int unsigned)
		BEGIN
			INSERT INTO logs(user_id, message) VALUES(userid, concat((select username from users where user_id = userid), " delete sponsor ", (select sponsor_name from sponsor where sponsor_id = sponsorId)));
			DELETE FROM sponsor where sponsor_id = sponsorId;
		END;
%%
	--LOGIN Functions--
	CREATE PROCEDURE login(in uname varchar(50), in pass varchar(50))
		BEGIN
			INSERT INTO logs(user_id, message) VALUES((select user_id from users where username = BINARY uname), concat(uname, " logged in"));
			SELECT user_id,username FROM users WHERE username = BINARY uname and password = BINARY ENCODE(pass, uname);
		END;
%%
	CREATE PROCEDURE createUser(in uname varchar(50), in pass varchar(50), in utype enum('admin', 'normal'), in fname varchar(50), in lname varchar(50))
		BEGIN
			INSERT INTO users (username, password, user_type, firstname, lastname) VALUES (uname, ENCODE(pass, uname), utype, fname, lname);
			INSERT INTO logs(user_id, message) VALUES((select user_id from users where username = BINARY uname), concat("Created User ", uname));
		END;
%%
	CREATE PROCEDURE updateUser(in uid int(10), in uname varchar(50), in pass varchar(50), in fname varchar(50), in lname varchar(50), in ucollege varchar(50), in contact varchar(50), in mail varchar(100), in wt int(11), in ht int (11))
		BEGIN
			INSERT INTO logs(user_id, message) VALUES(uid, concat((select username from users where user_id = uid), " has been updated"));
			UPDATE users SET username=uname, firstname = fname, lastname = lname, college = ucollege, contactno = contact, email = mail, weight = wt, height = ht WHERE user_id = uid;
			UPDATE users SET password = ENCODE(pass, uname) WHERE username = uname;
		END;
%%
	CREATE PROCEDURE deleteUser(in uid int unsigned)
		BEGIN
			INSERT INTO logs(user_id, message) VALUES(uid, concat((select username from users where user_id = uid), " has been deleted"));
			DELETE FROM event WHERE user_id = uid;
			DELETE FROM logs WHERE user_id = uid;
			DELETE FROM team_players WHERE user_id = uid;
			DELETE FROM user_interests WHERE user_id = uid;
			DELETE FROM users WHERE user_id LIKE uid;
		END;
%%
	--User view Logs--
	CREATE PROCEDURE userViewLogs(in userid int unsigned)
		BEGIN
			SELECT * FROM logs where user_id = userid;
			INSERT INTO logs(user_id, message) VALUES(userid, concat((select username from users where user_id = userid), " viewed the logs"));
		END;
%%
DELIMITER ;

	--DUMMY DATA
	insert into users(username, password, user_type, firstname, lastname, college, contactno, email, weight, height) values("Tester", "test", "admin", "nathaniel", "carvajal", "CAS", 09166994203, "nfcarvajal@up.edu.ph", 59, 177);
	insert into users(username, password, user_type, firstname, lastname, college, contactno, email, weight, height) values("Tester2", "test", "admin", "nathaniel", "carvajal", "CAS", 09166994203, "nfcarvajal@up.edu.ph", 59, 177);

	insert into venue(latitude, longitude, address, venue_name) values(12.23,32.123, "los banos, laguna", "Copeland Gymasium");

	call addEvent(1, "Malicsihan", "2017-12-23", "2017-12-25");
	call addEvent(2, "Palicsihan", "2017-12-23", "2017-12-25");

	call sportInsert(1, 1, "Basketballl");
	call sportInsert(1, 1, "Volleyball");
	call sportInsert(2, 2, "Badminton");
	call sportInsert(2, 2, "Phil. Games");

	call addGame(1, 1, 1, "2017-12-23 11:59:59", 1, "Ma'am Kat");
	call addGame(2, 2, 1, "2017-12-23 11:59:59", 1, "Ma'am K");

	call addTeam(1, "team1");
	call addTeam(1, "team2");
	call userJoinsTeam(1, "team1");

	call userJoinsTeam(2, "team1");

	call teamPlayGame(1, 1, 1);
	call teamPlayGame(1, 2, 1);

	call addSponsor(1, "ArvinSartilloCompany");
	call addSponsor(1, "Tester");
	call addSponsor(1, "DanCalixtoCompany");

	call sponsorEvent(1, 1, 1);
	call sponsorEvent(1, 1, 2);
	call sponsorEvent(1, 2, 1);
	call sponsorEvent(1, 2, 2);
	call sponsorEvent(1, 3, 1);
	call sponsorEvent(1, 3, 2);

	--call deleteUser(2);
	--SELECT A.team_name, B.team_name FROM team A, team B WHERE A.team_id IN (SELECT team_id FROM team_plays_game WHERE game_id = 1) AND B.team_id IN (SELECT team_id FROM team_plays_game WHERE game_id = 1) AND A.team_id != B.team_id;
