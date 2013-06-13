'use strict';

/**
* configuration of Restangular and the routeProvider
*/          
var app = angular.module('postySoft', ['postySoft.directives', 'postySoft.models', 'postySoft.services', 'postySoft.controllers', 'restangular', 'ui.bootstrap']);
app.config(function($routeProvider, RestangularProvider) { 
    RestangularProvider.setBaseUrl(serverUrl);	
	
 	RestangularProvider.setListTypeIsArray(true);

	$routeProvider.when('/view_dashboard', {templateUrl: 'partials/partial_dashboard.html', controller: DashboardCtrl});
    $routeProvider.when('/view_account', {templateUrl: 'partials/partial_account.html', controller: AccountCtrl});
    $routeProvider.when('/view_alias', {templateUrl: 'partials/partial_alias.html', controller: AliasCtrl});
    $routeProvider.when('/view_domain', {templateUrl: 'partials/partial_domain.html', controller: DomainCtrl});
    $routeProvider.otherwise({redirectTo: '/view_dashboard'});
});