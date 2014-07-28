/*!
 * posty_webUI
 *
 * Copyright 2014 posty-soft.org
 * Licensed under the LGPL v3
 * https://www.gnu.org/licenses/lgpl.html
 *
 */
require.config({
    paths: {
        angular: '../components/angular/angular',
        angularRoute: '../components/angular-route/angular-route',
        angularMocks: '../components/angular-mocks/angular-mocks',
        angularBootstrap: '../components/angular-bootstrap/ui-bootstrap-tpls',
        text: '../components/requirejs-text/text',
        restangular: '../components/restangular/src/restangular',
        underscore: '../components/underscore/underscore',
        d3: '../components/d3/d3',
        postyWebModel: '../components/posty-web-model/posty-web-model'
    },
    shim: {
        'angular': {'exports': 'angular'},
        'angularRoute': ['angular'],
        'angularMocks': {
            deps: ['angular'],
            'exports': 'angular.mock'
        },
        'angularBootstrap': ['angular'],
        'restangular': {
            deps: ['underscore', 'angular']
        },
        'postyWebModel': {
            deps: ['angular','restangular'] 
        }
    },
    priority: [
        "angular"
    ]
});

//http://code.angularjs.org/1.2.1/docs/guide/bootstrap#overview_deferred-bootstrap
window.name = "NG_DEFER_BOOTSTRAP!";

require([
    'angular',
    'app',
    'routes',
    'angularBootstrap',
    'restangular',
    'postyWebModel'
], function (angular, app, routes) {
    'use strict';
    var $html = angular.element(document.getElementsByTagName('html')[0]);

    angular.element().ready(function () {
        angular.resumeBootstrap([app['name']]);
    });
});
