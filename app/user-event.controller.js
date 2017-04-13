(function(){
	'use strict'
	angular
	.module('malicsi')
	.controller('userEventController',userEventController);

	function userEventController($http,$location,$routeParams){
		var vm = this;

		vm.allSports = [];
		vm.allSportGames;
		vm.allGames = [];
		vm.viewGame = viewGame;
		vm.viewGamesByEvent = viewGamesByEvent;
		vm.viewSportByEvent = viewSportByEvent;
		vm.scoreboard = scoreboard;
		vm.event_id = $routeParams.event_id;

		viewSportByEvent();

		function viewSportByEvent(){
			$http
				.get('/sport/event/' + $routeParams.event_id)
				.then(function(response){
					vm.allSports = response.data;
				},
				function(response){
					console.log("Error retrieving data!");
				});
		}


		function viewGamesByEvent(sport){
			var event = {
				event_event_id: $routeParams.event_id
			}
			console.log(event);
			$http
				.post('/game/sport/'+sport.sport_id,event)
				.then(function(response){
					vm.games = [];
					for (var i = 0; i != response.data.length; i++) {
						vm.games.push(response.data[i]);
					}
					while(vm.allGames.length!=(sport.sport_id-1)) vm.allGames.push(null);
					vm.allGames.push(vm.games);
					console.log(vm.allGames);
				},
				function(response){
					console.log("Error retrieving data!");
				});
		}

		function viewGame(game_id){
			$location.path('/user/game/' + game_id)
		}

		function scoreboard(){
			$location.path('/user/event/' + $routeParams.event_id + '/scoreboard')
		}

	}

})();