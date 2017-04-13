(function(){
	'use strict'
	angular
		.module('malicsi')
		.controller('activityLogController', activityLogController);

	function activityLogController($http){
		var vm = this
		vm.user = {};
		vm.allLogs = null;

		
		$http   
            .get('/user_loggedin') 
            .then(function(response) {
            	if(response.data){
            		$http
		                .get('/users/'+response.data)
		                .then(function(response) {
		                    vm.user = response.data;
		                    if(vm.user.user_type==='normal'){
			                	$http
			                        .get('/logs/'+vm.user.user_id)
			                        .then(function(response) {
			                        	console.log('here');
			                            vm.allLogs = response.data;
			                            console.log(vm.allLogs);
			                           modifyTime();
			                    });
		                    }
		                    else{
		                    	console.log('ADMIN');
			                	$http
									.get('/logs')
									.then(function(response) {
										if(response.data) {
											vm.allLogs = response.data;
											console.log(vm.allLogs);
											modifyTime();
										} else console.log('Error');
								});
			                }
		                }); 
            		}
            		else{
            			window.location.href ='/403';
            		}               
            });

        function modifyTime(){
        	console.log("MODIFIRD");
        	 vm.allLogs.forEach(function(e){
            	if(e.Minutes<60){
            		e.Time=e.Minutes + "m ago ";		
            	}
            	else if(e.Hour<24){
            		e.Time = e.Hour + "h ago " ;
            	}
            	else{
            		e.Time = e.Date;
            	}
            	
            });
        }

	}	

})();