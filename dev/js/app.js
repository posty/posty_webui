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
	'models',
	'conf',				
	'angularRoute',	
	], function (angular) {
		'use strict';
		// Declare app level module which depends on filters, and services		
		return angular.module('postySoft', [
			'ngRoute',
			'restangular',						
			'postySoft.controllers',
			'postySoft.models',			
			'postySoft.services',
			'postySoft.directives',
			'postySoft.configurations'			
        ]);
});
