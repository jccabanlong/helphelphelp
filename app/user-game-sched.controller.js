(function(){
	'use strict'
	angular
	.module('malicsi')
	.controller('userGameSchedController',userGameSchedController);

	function userGameSchedController($http,$location,$routeParams){
		var vm = this;

		vm.allScores = [];
		vm.allScores2 = [];
		vm.allSports = [];
		vm.allSportGames;
		vm.allGames = [];
		vm.rankList = [];
		vm.viewGame = viewGame;
		vm.viewGames = viewGames;
		vm.getScores = getScores;
		vm.getScores2 = getScores2;
		vm.viewSportsByEvent = viewSportsByEvent;
		vm.getRanking = getRanking;
		vm.viewGamesLeaderboards = viewGamesLeaderboards;

		viewSportsByEvent();

		function viewSportsByEvent(){
			$http
				.get('/sport/event/' + $routeParams.event_id)
				.then(function(response){
					vm.allSports = null;
					vm.allSports = response.data;
				},
				function(response){
					console.log("Error retrieving data!");
				});
		}

		function viewGames(sport){
			$http
				.get('/schedule/'+sport.sport_id)
				.then(function(response){

					vm.games = [];
					for (var i = 0; i != response.data.length; i++) {
						if(i%2 == 0) vm.games.push(response.data[i]); //to remove duplicates
					}
					while(vm.allGames.length!=(sport.sport_id-1)) vm.allGames.push(null);
					vm.allGames.push(vm.games);
					console.log(response.data[0] + sport.sport_name);
				},
				function(response){
					console.log("Error retrieving data!");
				});
		}

		function viewGamesLeaderboards(sport){
			$http
				.get('/leaderboard/'+sport.sport_id)
				.then(function(response){
					vm.games = [];
					for (var i = 0; i != response.data.length; i++) {
						if(i%2==0) vm.games.push(response.data[i]); //to remove duplicates
					}
					while(vm.allGames.length!=(sport.sport_id-1)) vm.allGames.push(null);
					vm.allGames.push(vm.games);
					
				},
				function(response){
					console.log("Error retrieving data!");
				});
		}

		function getScores(game){
			$http
				.get('/scores/' + game.game_id + '/' + game.team_id)
				.then(function(response){
					while(vm.allScores.length!=game.game_id) vm.allScores.push(null);
					if(response.data.length==0) vm.allScores.push(0);
					else vm.allScores.push(response.data[0].team_score);
					console.log('Viewing Score Successful');
			},
			function(response){
				console.log('Error Viewing Score');
			});
		}


		function getScores2(game){
			$http
				.get('/scores/' + game.game_id + '/' + game.team_id_2)
				.then(function(response){
					while(vm.allScores2.length!=game.game_id) vm.allScores2.push(null);
					if(response.data.length==0) vm.allScores2.push(0);
					else vm.allScores2.push(response.data[0].team_score);
					console.log('Viewing Score Successful');
			},
			function(response){
				console.log('Error Viewing Score');
			});
		}

		function getRanking(sport){
			$http
				.post('/ranking/' + sport.sport_id)
				.then(function(response){
					vm.rankList = response.data;
					console.log('Viewing Rank Successful');
			},
			function(response){
				console.log('Error Viewing Rank');
			});

		}

		function viewGame(game_id){
			$location.path('/user/game/' + game_id)
		}
	}

})();
