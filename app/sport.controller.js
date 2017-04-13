(function(){
	'use strict'
	angular
	.module('malicsi')
	.controller('sportController',sportController);

	function sportController($http,$routeParams){
		var vm = this;
		
		vm.allSports = null;
		vm.sport_id;
		vm.addSport = addSport;
		vm.updateSport = updateSport;
		vm.deleteSport = deleteSport;
		vm.deleteAllSports = deleteAllSports;
		vm.viewSport = viewSport;
		vm.viewAllSports = viewAllSports;
		vm.addSportName = null;
		vm.updateSportId = null;
		vm.updateSportName = null;

		viewAllSports();

		function addSport(){
			var sportToBeAdded = {
				sport_name: vm.addSportName,
			}
			$http
				.post('/sport/' + $routeParams.event_id, sportToBeAdded)
				.then(function(response){
					console.log('Adding Sport Successful!')
			},
			function(response){
				console.log('Error Adding Sport');
			});
		}
		
		function viewSport(id){
			$http
				.get('/sport' + id)
				.then(function(response){
					vm.allSports = response.data;
					console.log('Viewing Sport Successful');
			},
			function(response){
				console.log('Error Viewing Sport');
			});

		}
		function viewAllSports(){
			$http
				.get('/sport')
				.then(function(response){
					vm.allSports = response.data;
					console.log('Viewing All Sports Successful!');
			},
			function(response){
				console.log('Error Viewing All Sports');
			});

		}
		function updateSport(){
			var updatedSports = {
				sport_name: vm.updateSportName,
				sport_id: vm.updateSportId
			}
			$http
				.put('/sport', updatedSports)
				.then(function(response){
					console.log('Updating Sport Successful!');
			},
			function(response){
				console.log('Error Updating Sport');
			});

		}
		function deleteSport(id){
			$http
				.delete('/sport/' + id)
				.then(function(response){
					vm.allSports = response.data;
					console.log('Deleting Sport Successful!');
			},
			function(response){
				console.log('Error Deleting Sport');
			});
		}
		function deleteAllSports(){
			$http
				.delete('/sport')
				.then(function(response){
					console.log('Deleting All Sports Successful');
			},
			function(response){
				console.log('Error Deleting All Sports');
			});
		}
	}
})();
