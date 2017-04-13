(function(){
	'use strict'
	angular
	.module('malicsi')
	.controller('winnerController',winnerController);

	function winnerController($http){
		var vm = this;

		vm.viewWinner = viewWinner;
		vm.addWinner = addWinner;
		vm.updateWinner = updateWinner;
		vm.deleteWinner = deleteWinner;
		vm.deleteAllWinners = deleteAllWinners;
		vm.addWinnerTeamId = null;
		vm.addWinnerGameId = null;
		vm.updateWinnerTeamId = null;
		vm.updateWinnerGameId = null;
		vm.deleteWinnerGameId = null;
		vm.allWinner = [];
		vm.winner = null;

		$http
			.get('/winner')
			.then(function(response){
				vm.allWinner = response.data;
			},
			function(response){
				console.log("Error retrieving data!");
			});

		function viewAllWinners(){
			$http
				.get('/winner')
				.then(function(response){
					console.log("Viewing All Winners Successful! ");
					vm.allWinner = response.data;
				},
				function(response){
					console.log("Error retrieving data!");
				});
		}

		function viewWinner($gameid){
			$http
				.get('/winner/' + $gameid)
				.then(function(response){
					console.log("Viewing Winner Successful! ");
					vm.winner = response.data;
				},
				function(response){
					console.log("Error viewing winner!");
				});
		}

		function addWinner(){
			var winnerToBeAdded = {
				winner_team_id: vm.addWinnerTeamId,
				game_id: vm.addWinnerGameId
			}
			$http
				.post('/winner',winnerToBeAdded)
				.then(function(response){
					console.log("Updating Winner Successful! ");
				},
				function(response){
					console.log("Error adding winner!");
				});
		}

		function updateWinner(){
			vm.addWinnerTeamId = vm.updateWinnerTeamId;
			vm.addWinnerGameId = vm.updateWinnerGameId;
			addWinner();
		}

		function deleteWinner($gameid){
			$http
				.delete('/winner/' + $gameid)
				.then(function(response){
					console.log("Deleting Winner Successful! ");
				},
				function(response){
					console.log("Error deleting winner!");
				});
		}

		function deleteAllWinners(){
			$http
				.delete('/winner')
				.then(function(response){
					console.log("Deleting All Winners Successful! ");
				},
				function(response){
					console.log("Error deleting all winners!");
				});
		}
	}
})();
