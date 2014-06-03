/*!
 * posty_webUI
 *
 * Copyright 2014 posty-soft.org
 * Licensed under the LGPL v3
 * https://www.gnu.org/licenses/lgpl.html
 *
 */
define(['angular', 'services'], function (angular, services) {
	'use strict';

	/* Filters */
  
	var app = angular.module('postySoft.filters', ['postySoft.services']);

	app.filter('interpolate', ['version', function(version) {
		return function(text) {
			return String(text).replace(/\%VERSION\%/mg, version);
		};
	}]);
});
