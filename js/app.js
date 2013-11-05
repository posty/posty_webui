'use strict';

/**
* configuration of Restangular and the routeProvider
*/          
var app = angular.module('postySoft', ['postySoft.directives', 'postySoft.models', 'postySoft.services', 'postySoft.controllers', 'restangular', 'ui.bootstrap']);

app.config(function($routeProvider, $httpProvider, RestangularProvider) { 
    RestangularProvider.setBaseUrl(serverUrl);	
	
 	RestangularProvider.setListTypeIsArray(true);

	$routeProvider.when('/view_dashboard', {templateUrl: 'partials/partial_dashboard.html', controller: DashboardCtrl});
    $routeProvider.when('/view_account', {templateUrl: 'partials/partial_account.html', controller: AccountCtrl});    
    $routeProvider.when('/view_domain', {templateUrl: 'partials/partial_domain.html', controller: DomainCtrl});
    $routeProvider.when('/view_summary', {templateUrl: 'partials/partial_summary.html', controller: SummaryCtrl});
    $routeProvider.otherwise({redirectTo: '/view_dashboard'});

    $httpProvider.defaults.headers.common['auth_token'] = '123456';
});