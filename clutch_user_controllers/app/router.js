'use strict';

(function() {
	angular.module('malicsi')
			.config(router)

	function router($routeProvider) {
		$routeProvider
			.when('/teams/:team_id',{
				templateUrl: 'layouts/user-view-team.html'
			})
			.when('/user/teams', {
				templateUrl: 'layouts/user-view-teams.html'
			})
			.when('/', {
				templateUrl: 'layouts/login.html'
			})
			.when('/users', {
				templateUrl: 'layouts/admin-list-users.html'
			})
            .when('/user/home', {
				templateUrl: 'layouts/user-dashboard.html'
			})
			.when('/user/profile', {
				templateUrl: 'layouts/user-profile.html'
			})
			.when('/user/activity-log', {
				templateUrl: 'layouts/user-activity-log.html'
			})
			.when('/user/new-event', {
				templateUrl: 'layouts/user-create-event.html'
			})
			.when('/user/events', {
				templateUrl: 'layouts/user-event.html',
				controller: 'eventController',
				controllerAs: 'event'
			})
			.when('/user/events',{
				templateUrl:'layouts/user-event.html'
			})
			.when('/events/:event_id',{
				templateUrl: 'layouts/user-view-event.html',
				controller: 'eventController',
				controllerAs: 'event'
			})
			.when('/user/game', {
				templateUrl: 'layouts/user-game-page.html',
				controller:'gameController',
				controllerAs:'game'
			})
			.when('/user/game/sched', {
				templateUrl: 'layouts/user-game-sched.html'
			})
			.when('/user/scoreboard', {
				templateUrl: 'layouts/user-scoreboard-page.html'
			})
			.when('/hehe', {
				templateUrl: 'layouts/user-team-page.html'
			})
			.when('/user/teams', {
				templateUrl: 'layouts/user-view-all-teams.html'
			})
			.when('/user/search', {
				templateUrl: 'layouts/user-search-page.html'
			})
			.when('/admin/all-users', {
				templateUrl: 'layouts/admin-all-users.html'
			})
			.when('/admin/all-events', {
				templateUrl: 'layouts/admin-all-events.html'
			})
			.when('/admin/all-sponsors', {
				templateUrl: 'layouts/admin-all-sponsors.html'
			})
			.when('/admin/all-games', {
				templateUrl: 'layouts/admin-all-games.html'
			})
			.when('/admin/all-sports', {
				templateUrl: 'layouts/admin-all-sports.html'
			})
			.when('/admin', {
				templateUrl: 'layouts/admin-homepage.html'
			})
			.otherwise({
				templateUrl: 'layouts/error.html'
			})
	}
})();
