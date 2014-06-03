/*!
* posty_webUI
*
* Copyright 2014 posty-soft.org
* Licensed under the LGPL v3
* https://www.gnu.org/licenses/lgpl.html
*
*/
define(['angular'], function (angular) {
	'use strict';

	/* Configurations */

	var app = angular.module('postySoft.configurations', ['postySoft.services', 'ui.bootstrap']); 

	/**
	* Configuration of the Apllication-Settings
	*/
	app.config(['$httpProvider', 'RestangularProvider', 'ProcessServiceProvider', 'CONFIGS', function($httpProvider, RestangularProvider, ProcessServiceProvider, CONFIGS) { 
	    /* Setting the server-base-url */
	    RestangularProvider.setBaseUrl(CONFIGS.SERVER_URL);	    		

	    /* Setting configurations before a request is send */
		RestangularProvider.setRequestInterceptor(
			function(elem, operation, what) {        
				ProcessServiceProvider.register();					
				return elem;
			}
		);	

		/* Setting configurations after a response was received */
		RestangularProvider.setResponseInterceptor(
			function(data, operation, what) {				
				ProcessServiceProvider.unregister();					
				return data;
			}
		);	

		/* Setting configurations after an error was received */
		RestangularProvider.setErrorInterceptor(
			function(response) {
				ProcessServiceProvider.unregister();					
				return true;
			}
		);					    

	    /* Setting the server-authentication-key */
	    $httpProvider.defaults.headers.common['auth_token'] = CONFIGS.SERVER_AUTH_KEY;
	}]);
	
	/**
	* Configuration of the Apllication-Views
	*/
	app.config(['datepickerConfig', 'datepickerPopupConfig', 'CONFIGS', function (datepickerConfig, datepickerPopupConfig, CONFIGS) {
		datepickerConfig.minDate = null;
		datepickerConfig.maxDate = null;
		datepickerConfig.startingDay = 1; // monday
		datepickerConfig.initDate = new Date();
		datepickerPopupConfig.datepickerPopup = CONFIGS.DATE_FORMAT;
    }]);

	/**
	* Global constants for the Application
	*/
	app.constant('CONFIGS',{
		DATE_FORMAT: 'dd.MM.yyyy',
		API_DATE_FORMAT: 'yyyy-MM-dd HH:mm:ss',
		SERVER_URL: 'http://EXAMPLE.org/api/v1',
		SERVER_AUTH_KEY: 'YOUR API KEY'
	});

});
