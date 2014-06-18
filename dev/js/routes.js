/*!
 * posty_webUI
 *
 * Copyright 2014 posty-soft.org
 * Licensed under the LGPL v3
 * https://www.gnu.org/licenses/lgpl.html
 *
 */
define(['angular', 'app'], function (angular, app) {
    'use strict';

    return app.config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/view_dashboard', {
            templateUrl: 'partials/partial_dashboard.html',
            controller: 'DashboardCtrl'
        });
        $routeProvider.when('/view_domain', {
            templateUrl: 'partials/partial_domain.html',
            controller: 'DomainCtrl'
        });
        $routeProvider.when('/view_transport', {
            templateUrl: 'partials/partial_transport.html',
            controller: 'TransportCtrl'
        });
        $routeProvider.when('/view_user', {
            templateUrl: 'partials/partial_user.html',
            controller: 'UserCtrl'
        });
        $routeProvider.when('/view_summary', {
            templateUrl: 'partials/partial_summary.html',
            controller: 'SummaryCtrl'
        });
        $routeProvider.when('/view_apikey', {
            templateUrl: 'partials/partial_apikey.html',
            controller: 'ApiKeyCtrl'
        });
        $routeProvider.when('/error', {
            templateUrl: 'partials/partial_error.html',
            controller: 'ErrorCtrl'
        });
        $routeProvider.otherwise({redirectTo: '/view_dashboard'});
    }]);
});