(function(){
	'use strict'
	angular
		.module('malicsi')
		.controller('adminController', adminController);

	function adminController($http){
		var vm = this;

		vm.allLogs = [];
		vm.allUsers = [];
		vm.deleteUser = deleteUser;
		vm.updateUser = updateUser;
		vm.password = "";
		vm.openModal = openModal;
		vm.closeModal= closeModal;
		vm.currentUserId = null;

		$http
			.get('/users')
			.then(function(response) {
				vm.allUsers = response.data;
				console.log(response.data);
			}, function(response){
				console.log('Error');
			});

		function deleteUser(user_id){
			console.log(user_id);
			$http.delete('/users/' + user_id)
				.then(function(response){
					console.log('Deleted User');
					window.location.reload();
				}, function(response){
					console.log('Error');
				});
		}

		function addUser(){
			// console.log(user_id);
			$http.post('/addUser')
				.then(function(response){
					console.log('Added User');
					window.location.reload();
				}, function(response){
					console.log('Error');
				});
		}

		function updateUser(user_id){
			var user = {
				password : vm.password
			}
			$http.put('/users/passwords/' + user_id, password)
				.then(function(response){
					closeModal('edit-modal');
					console.log('Updated User');
				}, function(response){
					console.log('Cannot update user password');
				});
		}

		function openModal(dmodal){
			$('#'+dmodal+'.modal')
		 	.modal('setting', {
				 closable: false
			})
			.modal('show');
		
		}
		function closeModal(dmodal){
			$('#'+dmodal+'.modal')
			 	.modal('hide');	
		}
	}
})();
