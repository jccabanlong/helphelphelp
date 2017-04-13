(function(){
    'use strict'
    angular
        .module('malicsi')
        .controller('sponsorController', sponsorController);

    function sponsorController($http){
        var vm = this;
        
        vm.viewAllSponsor = viewAllSponsor;
        vm.addSponsor = addSponsor;
        vm.deleteSponsor = deleteSponsor;
        vm.updateSponsor = updateSponsor;
        vm.newSponsor = "";
        vm.newSponsorId;
        vm.newSponsorName = "";
        vm.allSponsors = [];
        
        function addSponsor() {    
            var sponsorToBeAdded = {
                 sponsor_name: vm.newSponsor
            }
        $http
            .post('/sponsors', sponsorToBeAdded)
            .then(function(response){
                    console.log(response.data);
                    console.log('Success! Sponsor Added!')
                },
                function(response){
                    console.log("Error :()");
                });
        }

        function sponsorEvent() { 
            var sponEvent = {
                sponsor_id: vm.sponsorId,
                event_id : vm.eventId
            };
            $http
                .post('/sponsors',sponEvent)
                .then(function(response){
                    console.log(response.data);
                },
                function(response){
                    console.log("error");
                });
        }

    function getData() {
        $http
        .get('/sponsors')
        .then(function(response){
            vm.allSponsors = response.data[0];
        },
        function(response){
            console.log("error");
        });
    }

    function interval(){
        setTimeout(function() {
        viewAllSponsor();
        interval();
    }, 1000);
    }


    function deleteSponsor(id) {
        $http
            .delete('/sponsors/'+id)
            .then(function(response){
            console.log('Sponsor deleted')
        },
        function(response){
            console.log("error");   
        });
    }



    function updateSponsor() {
            var sponsorToBeUpdated = {
                sponsor_id: vm.newSponsorId,
                sponsor_name: vm.newSponsorName
            };
            $http
                .put('/sponsors', sponsorToBeUpdated)
                .then(function(response){
                console.log(response.data);
                console.log('Success! Sponsor Updated!')
            },
            function(response){
                console.log("Error :()");
            });
        }


    function viewAllSponsor() {
        $http
            .get('/sponsors')
            .then(function(response){
            vm.allSponsors = response.data[0];
            console.log(response.data);
            console.log('Viewing Sponsors!')
        },
            function(response){
                console.log("error");   
            });


        function viewSponsor(id) {
        $http
                .get('/sponsors/'+id)
                .then(function(response){
                    vm.allSponsors = response.data[0];
                    console.log(response.data);
                    console.log('Viewing Sponsors!')
            },
            function(response){
                console.log("error");   
            });
        }
    }
}
})();