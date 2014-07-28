/*!
 * posty_webUI
 *
 * Copyright 2014 posty-soft.org
 * Licensed under the LGPL v3
 * https://www.gnu.org/licenses/lgpl.html
 *
 */
define([
    'angular',
    'services',
    'directives',
    'controllers',    
    'conf',
    'angularRoute'
], function (angular) {
    'use strict';

    return angular.module('postySoft', [
        'ngRoute',
        'restangular',
        'postySoft.models',        
        'postySoft.controllers',        
        'postySoft.services',
        'postySoft.directives',
        'postySoft.configurations'
    ]);
});
