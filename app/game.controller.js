(function(){
	'use strict'
	angular
	.module('malicsi')
	.controller('gameController',gameController);

	function gameController($http,$routeParams){
		var vm = this;
		
		vm.game = null;
		vm.allGames = null;
		vm.game_id;
		vm.user_id = 1;
		vm.score = 0;
		vm.score2 = 0;
		vm.addGame = addGame;
		vm.updateGame = updateGame;
		vm.deleteGame = deleteGame;
		vm.getScores = getScores;
		vm.getScores2 = getScores2;
		vm.deleteAllGames = deleteAllGames;
		vm.viewGame = viewGame;
		vm.canBet = canBet;
		vm.userCanbet = true;
		vm.viewAllGames = viewAllGames;
		vm.bet = bet;
		vm.addSportId = null;
		vm.addVenueId = null;
		vm.addDate = null;
		vm.addTime = null;
		vm.addDuration = null;
		vm.addReferee = null;
		vm.updateGameId = null;
		vm.updateSportId = null;
		vm.updateVenueId = null;
		vm.updateReferee = null;
		
		function addGame(){
			var gameToBeAdded = {
				sport_id: vm.addSportId,
				venue_id: vm.addVenueId,
				event_id: $routeParams.event_id,
				date_start: vm.addDate,
				time_start: vm.addTime,
				duration: vm.addDuration,
				referee: vm.addReferee
			}
			$http
				.post('/game',gameToBeAdded)
				.then(function(response){
					console.log('Adding Game Successful!');
			},
			function(response){
				console.log('Error');
			});

		}
		function viewGame(){
			$http
				.get('/game/' + $routeParams.game_id)
				.then(function(response){
					vm.game = response.data;
					vm.getScores(vm.game);
					vm.getScores2(vm.game);
					console.log('Viewing Game Successful');
			},
			function(response){
				console.log('Error Viewng Game');
			});
		}

		function canBet(){
			$http
				.get('/bet/' + vm.user_id + '/' + $routeParams.game_id )
				.then(function(response){
					if(response.data.length == 0){
						vm.userCanbet = true;
					}
					else vm.userCanbet = false;
			},
			function(response){
				console.log('Error Viewng Game');
			});
		}

		function bet(game_id,team_id){
			var bet ={
				game_id: game_id,
				team_id: team_id
			}
			$http
				.post('/bet/' + vm.user_id,bet)
				.then(function(response){
					// vm.game = response.data;
					console.log('Betting Successful');
			},
			function(response){
				console.log('Error Viewng Game');
			});

		}
	
		function viewAllGames(){
			$http
				.get('/game')
				.then(function(response){
					console.log('Viewing All Games Successful');
					vm.allGames = response.data;
			},
			function(response){
				console.log('Error Viewing All Games');
			});

		}
		function updateGame(){
			var updatedGames = {
				sport_id: vm.updateSportId,
				venue_id: vm.updateVenueId,
				referee: vm.updateReferee
			}
			$http
				.put('/game/' + vm.updateGameId, updatedGames)
				.then(function(response){
					console.log('Updating Game Successful!');
			},
			function(response){
				console.log('Error Updating Game');
			});

		}
		function deleteGame(id){

			$http
				.delete('/game/' + id)
				.then(function(response){
					vm.allGames = response.data;
					console.log('Deleting Game Successful!');
			},
			function(response){
				console.log('Error Deleting Game');
			});
		}
		function deleteAllGames(){

			$http
				.delete('/game')
				.then(function(response){
					console.log('Deleting All Games Successful!');
			},
			function(response){
				console.log('Error Deleting All Games');
			});
		}

		function getScores(game){
			$http
				.get('/scores/' + game.game_id + '/' + game.team_id)
				.then(function(response){
					if(response.data.length!=0) vm.score = response.data[0].team_score;
			},
			function(response){
				console.log('Error Viewing Score');
			});
		}


		function getScores2(game){
			$http
				.get('/scores/' + game.game_id + '/' + game.team_id_2)
				.then(function(response){
					if(response.data.length!=0) vm.score2 = response.data[0].team_score;
			},
			function(response){
				console.log('Error Viewing Score');
			});
		}
	}
})();
