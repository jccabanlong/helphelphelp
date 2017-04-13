(function(){
	'use strict'
	angular
		.module('malicsi')
		.controller('profileController', profileController);

	function profileController($http){
		var vm = this;
		
		vm.interests = "";
        vm.kiw = "DADA";

		vm.user = {};
		vm.userEvents = {};
		vm.userInterests = {};
		vm.sponsoredEvents = {};


		vm.openModal = openModal;
		vm.closeModal= closeModal;
		vm.updateUser= updateUser;
        vm.updateInterest= updateInterest;
		vm.deleteInterest= deleteInterest;

		$http   
            .get('/user_loggedin') 
            .then(function(response) {
                if (response.data){
                    $http
                        .get('/users/'+response.data)
                        .then(function(response) {
                            vm.user = response.data;

                        });

                    $http
                        .get('/user/events/'+response.data)
                        .then(function(response) {
                            vm.userEvents = response.data;


                        });

                    $http
                        .get('/user/sponsored/'+response.data)
                        .then(function(response) {
                            vm.sponsoredEvents = response.data;

                        });

                     $http
                        .get('/user/interests/'+response.data)
                        .then(function(response) {
                            vm.userInterests = response.data;
                            console.log(vm.userInterests);
                        });
                }
                else{
                	window.location.href ='/403';
                }
            });
	
		function updateUser(user,uname,pw,loc,college,age,height,weight,fname,lname,email,contactno,gender){
			var editUser=vm.user;
			var flag = "false";
			if(uname == "" || typeof(uname)== 'undefined'){
                uname= user.username
            }
            if(pw =="" || typeof(pw)=='undefined'){
                pw=user.password //the pw is still encrypted
                flag = "true";
            }
            if(loc =="" || typeof(loc)=='undefined'){
                loc= user.location
            }
            if(college =="" || typeof(college)== 'undefined'){
                college= user.college
            }
            if(age =="" || typeof(age)=='undefined'){
                age = user.age
            }
            if(height =="" || typeof(height)=='undefined'){
                height= user.height
            }
            if(weight =="" || typeof(weight)== 'undefined'){
                weight= user.weight
            }
            if(fname =="" || typeof(fname)=='undefined'){
                fname = user.firstname
            }
            if(lname =="" || typeof(lname)=='undefined'){
                lname= user.lastname
            }
            if( email =="" || typeof(email)=='undefined'){
                email= user.email
            }
            if(contactno =="" || typeof(contactno)=='undefined'){
                contactno= user.contactno
            }
            if(gender =="" || typeof(gender)=='undefined'){
                gender= user.gender
            }
            editUser.username=uname;
            editUser.password=pw;
            editUser.location=loc;
            editUser.college=college;
            editUser.age=age;
            editUser.height=height;
            editUser.weight=weight;
            editUser.firstname=fname;
            editUser.lastname=lname;
            editUser.email=email;
            editUser.contactno=contactno;
            editUser.gender=gender;
            editUser.flag=flag;
          	$http
                .put('/users/'+editUser.user_id, editUser)
                .then(function(response) {
                	delete editUser.flag;
                	vm.user=editUser;
                    console.log(response.data);
                });
			window.location.reload();
		}

		function updateInterest(){
			var user = {
				interests: vm.interests
			}

			$http
				.get('user_loggedin')
				.then(function(response){
					 $http
                        .put('/users/interests/'+response.data, user)
                        .then(function(response) {
                        	console.log("Added interest");
                        });
				});
			//window.location.reload();		
		}

        function deleteInterest(interest){

            var users = {
                myInterest:interest
            }
            console.log(users.myInterest)
            $http
                .get('user_loggedin')
                .then(function(response){
                     $http
                        .delete('/users/interests/' + response.data+"/" + users.myInterest)
                        .then(function(response){

                        });
                });
            //window.location.reload();     
        }


		function openModal(dmodal){
			console.log("I WAS CLICKED");
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