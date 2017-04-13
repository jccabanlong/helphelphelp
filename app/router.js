'use strict';

(function() {
	angular.module('malicsi')
			.config(router)

	function router($routeProvider) {
		$routeProvider
			.when('/', {
					templateUrl: 'layouts/login.html',
					controller:'userController'
			})
			.when('/teams/:team_id',{
				templateUrl: 'layouts/user-view-team.html'
			})
			.when('/user/teams', {
				templateUrl: 'layouts/user-view-teams.html'
			})
			.when('/users', {
				templateUrl: 'layouts/admin-all-users.html'
			})
			.when('/register', {
				templateUrl: 'layouts/register.html'
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
			.when('/user/event', {
				templateUrl: 'layouts/user-event.html',
				controller: 'eventController',
				controllerAs: 'event'
			})
			.when('/user/events', {
				templateUrl: 'layouts/user-view-all-events.html',
				controller: 'eventController',
				controllerAs: 'event'
			})
			.when('/event',{
				templateUrl:'layouts/user-event.html'
			})
			.when('/events/:event_id',{
				templateUrl:'layouts/user-view-event.html',
				controller: 'eventController',
				controllerAs: 'event'
			})
			.when('/user/game', {
				templateUrl: 'layouts/user-game-page.html',
				controller:'gameController',
				controllerAs:'game'
			})
			.when('/user/event/:event_id'	, {
				templateUrl: 'layouts/user-event-sports.html',
				controller: 'userEventController',
				controllerAs: 'event'
			})
			.when('/user/event/:event_id/scoreboard', {
				templateUrl: 'layouts/user-scoreboard-page.html',
				controller:'userGameSchedController',
				controllerAs:'UGSC'
			})
			.when('/user/game/:game_id', {
				templateUrl: 'layouts/user-game-page.html',
				controller:'gameController',
				controllerAs:'game'
			})
			.when('/user/gameSched', {
				templateUrl: 'layouts/user-game-sched.html',
				controller:'userGameSchedController',
				controllerAs:'UGSC'
			})
			.when('/user/team', {
				templateUrl: 'layouts/user-view-teams.html'
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
