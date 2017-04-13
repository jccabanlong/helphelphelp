(function(){
    'use strict'
    angular
        .module('malicsi')
        .controller('sponsorController', sponsorController);

    function sponsorController($http,$routeParams){
        var vm = this;
        
        vm.viewAllSponsor = viewAllSponsor;
        vm.addSponsor = addSponsor;
        vm.deleteSponsor = deleteSponsor;
        vm.updateSponsor = updateSponsor;
        vm.sponsorName = "";
        vm.newSponsorId;
        vm.sponsorId = null;
        vm.newSponsorName = "";
        vm.allSponsors = [];
        vm.allEventSponsors = [];
        vm.sponsorEvent = sponsorEvent;
        vm.getSponsorByEvent = getSponsorByEvent;
        vm.setSponsorId = setSponsorId;
        vm.deleteSponsorFromEvent = deleteSponsorFromEvent;
        function addSponsor() {    
            var sponsorToBeAdded = {
                 sponsor_name: vm.sponsorName
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


        function setSponsorId(sponsor_id){
            vm.sponsorId = sponsor_id;
        }



    function sponsorEvent() {
        if(vm.sponsorId == undefined){
            console.log("Select a legitimate sponsor");
        } 
        else{
            console.log($routeParams.event_id);
            console.log(vm.sponsorId);
            var sponEvent = {
                sponsor_id: vm.sponsorId,
                event_id : $routeParams.event_id
            };
        $http
            .post('/sponsors_event',sponEvent)
            .then(function(response){
                console.log(response.data);
                getSponsorByEvent();
                },
                function(response){
                    console.log("error");
                });
            }
    }

    /*function getSponsorId(sponsor_name,event_id){
        $http
            .get('/sponsors_get_id/'+sponsor_name)
            .then(function(response){
                console.log("Sponsor Event Success");
                vm.sponsorId = response.data[0].sponsor_id;
                console.log("ID" + vm.sponsorId);
                sponsorEvent(vm.sponsorId,event_id);
            },
            function(response){
                console.log('error');
            });

    }
    */



    function getSponsorByEvent(){
        $http
            .get('/sponsors_by_event/'+$routeParams.event_id)
            .then(function(response){
                console.log(response.data);
                vm.allEventSponsors = response.data[0];
            },
            function(response){
                console.log("error");
            });
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

    function deleteSponsorFromEvent(sponsor_id){
        var deleteSponsorEvent = {
            sponsor_id: sponsor_id,
            event_id: $routeParams.event_id
        }
        console.log(deleteSponsorEvent);
        $http
            .post('/sponsors_from_event',deleteSponsorEvent)
            .then(function(response){
                console.log(response.data);
                getSponsorByEvent($routeParams.event_id);
            },
            function(response){
                console.log("error");
            })
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

    }
}
})();