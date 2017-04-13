/*
CMSC 128 MalICSi Database

Go to directory where malicsidb.sql is located or enter full path to file then run:
	mysql -u root -p < malicsidb.sql

*/


GRANT ALL PRIVILEGES ON malicsiDB.* TO "root"@"localhost" WITH GRANT OPTION;


DROP DATABASE IF EXISTS `malicsiDB`;

CREATE DATABASE IF NOT EXISTS `malicsiDB`;

USE `malicsiDB`;

create table users(
	user_id 		int unsigned auto_increment,
	username 		varchar(50) not null,
	password 		varchar(100) not null,
	user_type 		enum('admin','pending','normal'),
	gender 			enum('F','M'),
	firstname 		varchar(50) not null,
	lastname 		varchar(50) not null,
	college 		varchar(50),
	contactno 		varchar(50),
	email 			varchar(100),
	location		varchar(100),
	weight 			int DEFAULT 0,
	height 			int DEFAULT 0,
	age 			int DEFAULT 0,
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
	status			enum('accepted', 'rejected', 'pending'),
	constraint 		team_id_joins_event_fk foreign key(team_id) references team(team_id) ON DELETE CASCADE ON UPDATE CASCADE,
	constraint 		team_joins_event_id_fk foreign key(event_id) references event(event_id) ON DELETE CASCADE ON UPDATE CASCADE
);

create table sport(
	sport_id 		int unsigned auto_increment,
	sport_name		varchar(100),

	UNIQUE			(sport_name),
	constraint		sport_id_pk primary key(sport_id)
);

create table event_has_sport(
	h_event_id 		int unsigned,
	h_sport_id 		int unsigned,

	constraint 		h_event_id foreign key(h_event_id) references event(event_id) ON DELETE CASCADE ON UPDATE CASCADE,
	constraint 		h_sport_id foreign key(h_sport_id) references sport(sport_id) ON DELETE CASCADE ON UPDATE CASCADE
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
	event_event_id 	int unsigned,
	date_start		date,
	time_start 		time,
	duration		int,
	winner_team_id	int unsigned default NULL,
	referee 		varchar(100),
	constraint 		venue_id foreign key(venue_id) references venue(venue_id) ON DELETE CASCADE ON UPDATE CASCADE,
	constraint 		event_event_id_fk foreign key(event_event_id) references event(event_id) ON DELETE CASCADE ON UPDATE CASCADE,
 	constraint 		game_id_pk primary key(game_id)
);

create table game_score(
	game_id 		int unsigned,
	team_score_id 	int unsigned,
	team_score		int,

	constraint 		team_score_id_fk foreign key(team_score_id) references team(team_id) ON DELETE CASCADE ON UPDATE CASCADE,
	constraint		game_id_fk foreign key(game_id) references game(game_id) ON DELETE CASCADE ON UPDATE CASCADE
);

create table bet_status(
	b_game_id		int unsigned,
	b_player_id 	int unsigned,

	constraint		b_game_id foreign key(b_game_id) references	game(game_id) ON DELETE CASCADE ON UPDATE CASCADE,
	constraint 		b_player_id foreign key(b_player_id) references users(user_id) ON DELETE CASCADE ON UPDATE CASCADE
);

create table team_plays_game(
	game_id 		int unsigned,
	team_id 		int unsigned,
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
	event_id 		int unsigned
	/*constraint 		sponsor_id_fk foreign key(sponsor_id) references sponsor(sponsor_id) ON DELETE CASCADE ON UPDATE CASCADE,
	constraint 		event_id_fk foreign key(event_id) references event(event_id) ON DELETE CASCADE ON UPDATE CASCADE
	*/
);

DELIMITER %%
	-- USER
	CREATE TRIGGER userInsert AFTER INSERT ON users
		FOR EACH ROW
			BEGIN
				INSERT INTO logs(user_id, message) VALUES(NEW.user_id, concat("Created new user with user name: ", NEW.username));
			END;
%%
	CREATE TRIGGER userUpdate AFTER UPDATE ON users
		FOR EACH ROW
			BEGIN
				INSERT INTO logs(user_id, message) VALUES(OLD.user_id, concat("Updated his/her user profile with user name: ", NEW.username));
			END;
%%
	CREATE TRIGGER userDelete AFTER DELETE ON users
		FOR EACH ROW
			BEGIN
				INSERT INTO logs(user_id, message) VALUES(OLD.user_id, concat("Deleted user: ", OLD.username));
			END;

%%
	-- USER INTERESTS
	CREATE TRIGGER userInterestInsert AFTER INSERT ON user_interests
		FOR EACH ROW
			BEGIN
				DECLARE name varchar(50);
				SET name = (SELECT username from users where user_id=NEW.user_id LIMIT 1);
				INSERT INTO logs(user_id, message) VALUES (NEW.user_id,concat(name," has new interest : ", NEW.interests));
			END;
%%
	CREATE TRIGGER userInterestUpdate AFTER UPDATE ON user_interests
		FOR EACH ROW
			BEGIN
				DECLARE name varchar(50);
				SET name = (SELECT username from users where user_id=OLD.user_id LIMIT 1);
				INSERT INTO logs(user_id, message) VALUES(OLD.user_id, concat(name," updated his/her interest : ", NEW.interests));
			END;
%%
	CREATE TRIGGER userInterestDelete AFTER DELETE ON user_interests
		FOR EACH ROW
			BEGIN
				DECLARE name varchar(50);
				SET name = (SELECT username from users where user_id=OLD.user_id LIMIT 1);
				INSERT INTO logs(user_id, message) VALUES(OLD.user_id, concat(name, " deleted his/her interest : ", OLD.interests));
			END;

%%
	-- SPONSOR
	CREATE TRIGGER sponsorInsert AFTER INSERT ON sponsor
		FOR EACH ROW
			BEGIN
				INSERT INTO logs(message) VALUES(concat("Created new sponsor with sponsor name: ", NEW.sponsor_name));
			END;
%%
	CREATE TRIGGER sponsorUpdate AFTER UPDATE ON sponsor
		FOR EACH ROW
			BEGIN
				INSERT INTO logs(message) VALUES(concat("Updated sponsor profile with sponsor name: ", NEW.sponsor_name));
			END;
%%
	CREATE TRIGGER sponsorDelete AFTER DELETE ON sponsor
		FOR EACH ROW
			BEGIN
				INSERT INTO logs(message) VALUES(concat("Deleted sponsor: ", OLD.sponsor_name));
			END;
%%
	--SPONSOR OF EVENTS
CREATE TRIGGER sponsorEventInsert AFTER INSERT ON sponsor_events
		FOR EACH ROW
			BEGIN
				DECLARE name,eventname varchar(100);
				SET name = (SELECT sponsor_name from sponsor where sponsor_id=NEW.sponsor_id LIMIT 1);
				SET eventname = (SELECT event_name from event where event_id=NEW.event_id LIMIT 1);
				INSERT INTO logs(message) VALUES(concat(name, " sponsored the event: ",eventname));
			END;
%%
	CREATE TRIGGER sponsorEventDelete AFTER DELETE ON sponsor_events
		FOR EACH ROW
			BEGIN
				DECLARE name,eventname varchar(100);
				SET name = (SELECT sponsor_name from sponsor where sponsor_id=OLD.sponsor_id LIMIT 1);
				SET eventname = (SELECT event_name from event where event_id=OLD.event_id LIMIT 1);
				INSERT INTO logs(message) VALUES(concat(name, " stopped sponsoring on event: ",eventname));
			END;
%%
	--COMPETITOR/TEAM
	CREATE TRIGGER competitorInsert AFTER INSERT ON team
		FOR EACH ROW
			BEGIN
				INSERT INTO logs(message) VALUES(concat("Created new team: ", NEW.team_name));
			END;
%%
	CREATE TRIGGER competitorUpdate AFTER UPDATE ON team
		FOR EACH ROW
			BEGIN
				INSERT INTO logs(message) VALUES(concat("Updated the team name from ", OLD.team_name, " to", NEW.team_name));
			END;
%%
	CREATE TRIGGER competitortDelete AFTER DELETE ON team
		FOR EACH ROW
			BEGIN
				INSERT INTO logs(message) VALUES(concat("Deleted the team: ", OLD.team_name));
			END;

%%
	-- EVENT
	CREATE TRIGGER eventInsert AFTER INSERT ON event
		FOR EACH ROW
			BEGIN
				DECLARE name varchar(50);
				SET name = (SELECT username from users where user_id=NEW.user_id LIMIT 1);
				INSERT INTO logs(user_id, message) VALUES(NEW.user_id, concat(name," created new event: ", NEW.event_name));
			END;
%%

	CREATE TRIGGER eventUpdate AFTER UPDATE ON event
		FOR EACH ROW
			BEGIN
				INSERT INTO logs(message) VALUES(concat("The event ",NEW.event_name ," was updated"));
			END;
%%
	CREATE TRIGGER eventDelete AFTER DELETE ON event
		FOR EACH ROW
			BEGIN
				INSERT INTO logs(message) VALUES(concat("The event ",OLD.event_name ," was deleted"));
			END;
%%
	-- VENUE
	CREATE TRIGGER venueInsert AFTER INSERT ON venue
		FOR EACH ROW
			BEGIN
				INSERT INTO logs(message) VALUES(concat("Created new venue with name: ", NEW.venue_name));
			END;
%%
	CREATE TRIGGER venueUpdate AFTER UPDATE ON venue
		FOR EACH ROW
			BEGIN
				INSERT INTO logs(message) VALUES(concat("Updated venue with name: ", NEW.venue_name));
			END;
%%
	CREATE TRIGGER venueDelete AFTER DELETE ON venue
		FOR EACH ROW
			BEGIN
				INSERT INTO logs(message) VALUES(concat("Deleted venue with name: ", OLD.venue_name));
			END;
%%
	-- SPORTS
	CREATE TRIGGER sportInsert AFTER INSERT ON sport
		FOR EACH ROW
			BEGIN
				INSERT INTO logs(message) VALUES(concat("Added sport: ", NEW.sport_name));
			END;
%%
	CREATE TRIGGER sportUpdate AFTER UPDATE ON sport
		FOR EACH ROW
			BEGIN
				INSERT INTO logs(message) VALUES(concat("Updated sport name from ", OLD.sport_name," to ", NEW.sport_name));
			END;
%%

	CREATE TRIGGER sportDelete AFTER DELETE ON sport
		FOR EACH ROW
			BEGIN
				INSERT INTO logs(message) VALUES(concat("Deleted : ", OLD.sport_name));
			END;
%%
	-- TEAM_PLAYERS
	CREATE TRIGGER teamPlayerInsert AFTER INSERT ON team_players
		FOR EACH ROW
			BEGIN
				DECLARE name,tname varchar(100);
				SET name = (SELECT username from users where user_id=NEW.user_id LIMIT 1);
				SET tname = (SELECT team_name from team where team_id=NEW.team_id LIMIT 1);
				INSERT INTO logs(user_id,message) VALUES(NEW.user_id ,concat(tname,"'s added team player: ", name));
			END;
%%
	CREATE TRIGGER teamPlayerDelete AFTER DELETE ON team_players
		FOR EACH ROW
			BEGIN
				DECLARE name,tname varchar(100);
				SET name = (SELECT username from users where user_id=OLD.user_id LIMIT 1);
				SET tname = (SELECT team_name from team where team_id=OLD.team_id LIMIT 1);
				INSERT INTO logs(user_id,message) VALUES(OLD.user_id,concat(tname, "'s removed team player: ", name));
			END;
%%
	-- TEAM_JOINS_EVENTS
	CREATE TRIGGER teamJoinEventInsert AFTER INSERT ON team_joins_event
		FOR EACH ROW
			BEGIN
				DECLARE name,eventname varchar(100);
				SET name = (SELECT team_name from team where team_id=NEW.team_id LIMIT 1);
				SET eventname = (SELECT event_name from event where event_id=NEW.event_id LIMIT 1);
				INSERT INTO logs(message) VALUES(concat(name," requests to join event: ", eventname));
			END;
%%
	CREATE TRIGGER teamJoinEventUpdate AFTER UPDATE ON team_joins_event
		FOR EACH ROW
			BEGIN
				DECLARE name,eventname varchar(100);
				SET name = (SELECT team_name from team where team_id=NEW.team_id LIMIT 1);
				SET eventname = (SELECT event_name from event where event_id=NEW.event_id LIMIT 1);
				INSERT INTO logs(message) VALUES(concat(name,"'s request status to join ", eventname, ": ", NEW.status));
			END;
%%
	-- TEAM_PLAYS_GAME
	CREATE TRIGGER teamPlayGameInsert AFTER INSERT ON team_plays_game
		FOR EACH ROW
			BEGIN
				DECLARE name,sportname varchar(100);
				SET name = (SELECT team_name from team where team_id=NEW.team_id LIMIT 1);
				SET sportname =(SELECT sport_name from sport where sport_id= (select sport_id from game where game_id = NEW.game_id) LIMIT 1);
				INSERT INTO logs(message) VALUES(concat(name," plays game with gameID: ", NEW.game_id, " in ",sportname ));
			END;
%%
	CREATE TRIGGER teamPlayGameDelete AFTER DELETE ON team_plays_game
		FOR EACH ROW
			BEGIN
				DECLARE name,sportname varchar(100);
				SET name = (SELECT team_name from team where team_id=OLD.team_id LIMIT 1);
				SET sportname =(SELECT sport_name from sport where sport_id= (select sport_id from game where game_id = OLD.game_id) LIMIT 1);
				INSERT INTO logs(message) VALUES(concat(name," disqualified from game with ID: ", OLD.game_id, " in ",sportname ));
			END;
%%	-- GAME + WINNER
	CREATE TRIGGER gameInsert AFTER INSERT ON game
		FOR EACH ROW
			BEGIN
				DECLARE name varchar(100);
				SET name= (SELECT event_name from event where event_id=NEW.event_event_id LIMIT 1);
				INSERT INTO logs(message) VALUES(concat("Added new game with ID ", NEW.game_id, " in event ",name));
			END;
%%
	CREATE TRIGGER gameUpdate AFTER UPDATE ON game
		FOR EACH ROW
			BEGIN
				DECLARE name,ename varchar(100);
				SET ename= (SELECT event_name from event where event_id=NEW.event_event_id LIMIT 1);
				IF OLD.winner_team_id!=NEW.winner_team_id THEN
					SET name= (SELECT team_name from team where team_id=NEW.winner_team_id LIMIT 1);
					INSERT INTO logs(message) VALUES(concat("Winner of game with game ID : ", NEW.game_id, " is ",name, " in event ",ename ));
				ELSE
					INSERT INTO logs(message) VALUES(concat("Updated the game with ID ", NEW.game_id, " in event ",ename));
				END IF;
			END;
%%
	CREATE TRIGGER gameDelete AFTER DELETE ON game
		FOR EACH ROW
			BEGIN
				INSERT INTO logs(message) VALUES(concat("Deleted new game with ID : ", OLD.game_id));
			END;
%%
	/* END OF TRIGGERS */
	CREATE PROCEDURE addSport(in sportname varchar(100))
		BEGIN
			INSERT INTO sport(sport_name) VALUES(sportname);
		END;
%%
	CREATE PROCEDURE attachSportToEvent(in sportId int unsigned, in eventId int unsigned)
		BEGIN
			INSERT INTO event_has_sport(h_event_id, h_sport_id) VALUES(eventId, sportId);
		END;
%%

	CREATE PROCEDURE sportDelete(in sportid int unsigned)
		BEGIN
			DELETE FROM sport where sport_id = sportid;
		END;
%%

	CREATE PROCEDURE sportUpdate(in sportid int unsigned, in newSportName varchar(100))
		BEGIN
			UPDATE sport SET sport_name = newSportName where sport_id = sportid;
		END;
%%

	CREATE PROCEDURE viewAllSports()
		BEGIN
			SELECT * from sport;

		END;
%%
	CREATE PROCEDURE viewSport(in sportname varchar(100))
		BEGIN
			SELECT * FROM sport where sport_name = sportname;
		END;

%%
	CREATE PROCEDURE viewSportByEvent(in eventId int unsigned)
		BEGIN

			SELECT A.event_name, B.sport_name from event as A JOIN sport as B JOIN event_has_sport as C on (A.event_id = C.h_event_id) and (B.sport_id = C.h_sport_id) where (A.event_id = eventId);
		END;
%%
	CREATE PROCEDURE addGame(in sportid int unsigned, in venueid int unsigned, in eventId int unsigned, in datestart date, in timestart time, in durationIn int,in ref varchar(100))
		BEGIN
			INSERT INTO game(sport_id, venue_id, event_event_id, date_start, time_start, duration, referee) VALUES(sportid, venueid, eventId, datestart,timestart, durationIn, ref);

		END;
%%

	CREATE PROCEDURE deleteGame(in gameid int unsigned)
		BEGIN

			DELETE FROM game where game_id = gameid;
		END;
%%

	CREATE PROCEDURE updateGame(in gameid int unsigned, in newVenue int unsigned, in newSportId int unsigned, in newDateStart datetime, in newDuration int)
		BEGIN

			UPDATE game SET sport_id = newSportId, venue_id = newVenue, date_start = newDateStart, duration = newDuration where game_id = gameid;
		END;
%%
	CREATE PROCEDURE betStatus(in gameid int unsigned, in playerid int unsigned)
		BEGIN
			INSERT INTO bet_status(b_game_id, b_player_id) VALUES(gameid, playerid);
		END;
%%
	CREATE PROCEDURE viewAllGamesInSport(in sportId int unsigned, in eventId int unsigned)
		BEGIN
			SELECT * FROM game where sport_id = sportId and event_event_id = eventId;
		END;
%%
	CREATE PROCEDURE viewAllGames()
		BEGIN

			SELECT * FROM game;
		END;
%%
	CREATE PROCEDURE viewGame(in gameid int unsigned)
		BEGIN
			SELECT A.team_name, B.team_name FROM team A, team B WHERE A.team_id IN (SELECT team_id FROM team_plays_game WHERE game_id = gameid) AND B.team_id IN (SELECT team_id FROM team_plays_game WHERE game_id = gameid) AND A.team_id != B.team_id LIMIT 1;

		END;
%%

	--Winner ADD--

	CREATE PROCEDURE addWinner(in gameid int unsigned, in winnerid int unsigned)
		BEGIN
			UPDATE game SET winner_team_id = winnerid where game_id = gameid;
		END;
%%

	CREATE PROCEDURE viewAllWinners()
		BEGIN
			SELECT A.winner_team_id, B.team_name from game as A JOIN team as B on (B.team_id = A.winner_team_id);
		END;
%%

	CREATE PROCEDURE viewWinnerInGame(in gameid int unsigned)
		BEGIN
			SELECT A.winner_team_id, B.team_name from game as A JOIN team as B on A.game_id = gameid and (B.team_id = A.winner_team_id);
		END;
%%

	--CRUD FOR EVENT

	CREATE PROCEDURE addEvent(in userid int unsigned, in eventName varchar(100), in dateStart date, in dateEnd date)
		BEGIN

			INSERT INTO event(user_id, event_name, date_start, date_end, duration ) VALUES(userid, eventName, dateStart, dateEnd, datediff(dateEnd, dateStart));
		END;
%%

	CREATE PROCEDURE viewEvent(in eventId int unsigned)
		BEGIN
<<<<<<< HEAD

=======
>>>>>>> ee757fecd8e4cb9bd90e79891846a3f56d1d8dc4
			SELECT * FROM event where event_id = eventId;
		END;
%%
	CREATE PROCEDURE viewAllEvents()
		BEGIN

			SELECT * FROM event;
		END;
%%
	CREATE PROCEDURE viewEventBySport(in sportId int unsigned)
		BEGIN
			SELECT A.sport_name, B.event_name from sport as A JOIN event as B JOIN event_has_sport as C on (A.sport_id = C.h_sport_id) and (B.event_id = C.h_event_id) where (A.sport_id = sportId);
		END;
%%
	CREATE PROCEDURE updateEvent(in eventId int unsigned, in eventName varchar(100), in allowReg boolean, in dateStart date, in dateEnd date)
		BEGIN
			UPDATE event SET event_name = eventName, allow_reg = allowReg, date_start = dateStart, date_end = dateEnd, duration = datediff(dateEnd,dateStart) where event_id = eventId;
		END;
%%
	CREATE PROCEDURE deleteEvent(in eventId int unsigned)
		BEGIN
			DELETE FROM event where event_id = eventId;
		END;
%%

	--CRUD FOR TEAM

	CREATE PROCEDURE addTeam(in teamName varchar(100))
		BEGIN
			INSERT INTO team(team_name) VALUES(teamName);
		END;
%%
	CREATE PROCEDURE userJoinsTeam(in userid int unsigned, in teamId varchar(100))
		BEGIN
			INSERT INTO team_players(team_id, user_id) values((select team_id from team where team_name = teamName), userid);
		END;
%%
	CREATE PROCEDURE viewTeam(in teamId int unsigned)
		BEGIN
			SELECT A.team_name, B.username from team as A JOIN users as B JOIN team_players as C on (A.team_id = teamId) and (C.team_id = A.team_id) and (C.user_id = B.user_id);
		END;
%%
	CREATE PROCEDURE viewAllTeams()
		BEGIN
			SELECT * from team;
		END;
%%
	CREATE PROCEDURE updateTeam(in teamId int unsigned, in teamName varchar(100))
		BEGIN
			UPDATE team SET team_name = teamName where team_id = teamId;
		END;
%%
	CREATE PROCEDURE deleteTeam(in teamId int unsigned)
		BEGIN
			DELETE FROM team where team_id = teamId;

		END;
%%
	CREATE PROCEDURE teamJoinsEvent(in teamId int unsigned, in eventId int unsigned)
		BEGIN
			INSERT INTO team_joins_event(event_id,team_id, status) VALUES(eventId,teamId, 'pending');
		END;
%%
	CREATE PROCEDURE teamStatusUpdate(in teamId int unsigned, in eventId int unsigned, in nstatus enum('accepted', 'rejected', 'pending'))
		BEGIN
			UPDATE team_joins_event SET status = nstatus where team_id = teamId and event_id = eventId;
		END;
%%
	CREATE PROCEDURE teamPlaysGame(in teamId int unsigned, in gameId int unsigned)
		BEGIN
			INSERT INTO team_plays_game(game_id,team_id,bet_count) values(gameId,teamId,0);
			INSERT INTO game_score(game_id, team_score_id, team_score) values(gameId, teamId, 0);
		END;
%%
	CREATE PROCEDURE teamWinPoint(in teamId int unsigned, in gameId int unsigned, in addScore int)
		BEGIN
			UPDATE game_score SET score = addScore WHERE game_id = gameId and team_id = teamId;
		END;
%%

	--CRUD FOR SPONSORS


	CREATE PROCEDURE addSponsor(in sponsorName varchar(100))
		BEGIN
			INSERT INTO sponsor(sponsor_name) VALUES(sponsorName);
		END;
%%
	CREATE PROCEDURE sponsorEvent(in sponsorId int unsigned, in eventId int unsigned)
		BEGIN
			INSERT INTO sponsor_events(sponsor_id, event_id) VALUES(sponsorId, eventId);
		END;
%%
	CREATE PROCEDURE viewAllSponsors()
		BEGIN
			SELECT * FROM sponsor;
		END;
%%
	CREATE PROCEDURE viewSponsorByEvent(in eventId int unsigned)
		BEGIN
			SELECT A.event_name, B.sponsor_name, C.sponsor_id from event as A JOIN sponsor as B JOIN sponsor_events as C on (A.event_id = eventId) and (A.event_id = C.event_id) and (B.sponsor_id = C.sponsor_id);
		END;
%%
	CREATE PROCEDURE viewSponsor(in sponsorId int unsigned)
		BEGIN
			SELECT A.sponsor_name, B.event_name from sponsor as A JOIN event as B JOIN sponsor_events as C on (A.sponsor_id = sponsorId) and (A.sponsor_id = C.sponsor_id) and (B.event_id = C.event_id);
		END;
%%
	CREATE PROCEDURE updateSponsor(in sponsorId int unsigned, in sponsorName varchar(100))
		BEGIN
			UPDATE sponsor SET sponsor_name = sponsorName where sponsor_id = sponsorId;
		END;
%%
	CREATE PROCEDURE deleteSponsor(in sponsorId int unsigned)
		BEGIN
			DELETE FROM sponsor where sponsor_id = sponsorId;
		END;
%%


	--CRUD FOR VENUE


	CREATE PROCEDURE addVenue(in latitude float, in longitude float, address varchar(150), in venuename varchar(100))
		BEGIN
			INSERT INTO venue(latitude, longitude, address, venue_name) VALUES(latitude, longitude, address, venuename);
		END;
%%
	CREATE PROCEDURE viewVenue(in venuename varchar(100))
		BEGIN
			SELECT * FROM venue where venue_name = venuename;
		END;
%%
	CREATE PROCEDURE viewAllVenues()
		BEGIN
			SELECT * FROM venue;
		END;
%%
	CREATE PROCEDURE deleteVenue(in venuename varchar(100))
		BEGIN
			DELETE FROM venue where venue_name = venuename;
		END;
%%
	CREATE PROCEDURE updateVenue(in venueId int unsigned, in nlatitude float, in nlongitude float, naddress varchar(150), in nvenuename varchar(100))
		BEGIN
			UPDATE venue SET venue_name = nvenuename, latitude = nlatitude, longitude = nlongitude, address = naddress where venue_id = venueId;
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
<<<<<<< HEAD
DELIMITER ;
=======

DELIMITER ;
>>>>>>> ee757fecd8e4cb9bd90e79891846a3f56d1d8dc4

	call addTeam("TBA");
	call addTeam(" TBA ");

	insert into users(username, password, user_type, firstname, lastname, college, contactno, email, weight, height) values("Tester1", "test", "admin", "nathaniel", "carvajal", "CAS", 09166994203, "nfcarvajal@up.edu.ph", 59, 177);
	insert into users(username, password, user_type, firstname, lastname, college, contactno, email, weight, height) values("Tester2", "test", "admin", "nathaniel", "carvajal", "CAS", 09166994203, "nfcarvajal@up.edu.ph", 59, 177);

	insert into venue(latitude, longitude, address, venue_name) values(12.23,32.123, "Los Banos, Laguna", "Copeland Gymnasium");

	call addEvent(1, "Malicsihan", "2017-12-23", "2017-12-25");
	call addEvent(1, "Palicsihan", "2017-12-23", "2017-12-25");

	call addSport("Basketballl");
	call addSport("Volleyball");
	call addSport("Badminton");
	call addSport("Phil. Games");
	call addSport("Dota");
	call addSport("Soccer");
	call addSport("Javelin");

	call attachSportToEvent(1, 1);
	call attachSportToEvent(4, 1);
	call attachSportToEvent(5, 1);
	call attachSportToEvent(6, 1);
	call attachSportToEvent(7, 1);

	call attachSportToEvent(1, 2);
	call attachSportToEvent(2, 2);
	call attachSportToEvent(3, 2);

	call addGame(1, 1, 1,  "2017-12-23", "11:59:59", 1, "Ma'am Kat");
	call addGame(2, 1, 1, "2017-12-23", "11:59:59", 1, "Ma'am K");
<<<<<<< HEAD

	-- call addGame(1, 1, "2017-12-23", "11:59:59", 1, "Ma'am Kat");
	-- call addGame(2, 1, "2017-12-23", "11:59:59", 1, "Ma'am K");

=======
>>>>>>> ee757fecd8e4cb9bd90e79891846a3f56d1d8dc4

	call addTeam("team1");
	call addTeam("team2");

	call userJoinsTeam(1, "team1");
	call userJoinsTeam(1, "team1");

	call teamPlaysGame(1, 1);
	call teamPlaysGame(2, 1);

	call addSponsor("ArvinSartilloCompany");
	call addSponsor("Tester");
	call addSponsor("DanCalixtoCompany");

	call sponsorEvent(1, 1);
	call sponsorEvent(1, 2);
	call sponsorEvent(2, 1);
	call sponsorEvent(2, 2);
	call sponsorEvent(3, 1);
	call sponsorEvent(3, 2);
<<<<<<< HEAD


	--call deleteUser(2);
=======
>>>>>>> ee757fecd8e4cb9bd90e79891846a3f56d1d8dc4
