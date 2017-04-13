(function(){
	'use strict'
	angular
		.module('malicsi')
		.controller('loggedUserController', loggedUserController);

	function loggedUserController($http,$location,$rootScope){

	    var vm = this;
	    vm.userId = 1;

	}   
})();
