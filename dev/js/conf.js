/*!
* posty_webUI conf
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
	* Run-Configuration of the Apllication-Settings
	*/
	app.run(['Restangular', 'ProcessService', 'ResponseHandler', 'Servers', function(Restangular, ProcessService, ResponseHandler, Servers) {   		

	    /* Setting configurations before a request is send */
		Restangular.addRequestInterceptor(
			function(elem, operation, what, url) { 
				ProcessService.register();					
				return elem;
			}
		);	

		/* Setting configurations after a response was received */
		Restangular.addResponseInterceptor(			
			function(data, operation, what, url, response, deferred) {					
				ResponseHandler.add(response);					
				ProcessService.unregister();					
				return data;
			}
		);	

		/* Setting configurations after an error was received */
		Restangular.setErrorInterceptor(
			function(response) {																
				ResponseHandler.add(response);
				ProcessService.unregister();					
				return true;
			}
		);

		/* Adding the possible Server to connect with */
		angular.forEach(SETTINGS.servers, function(server){							
			Servers.add(server);
		});	
		if (!Servers.moreThanOneServer()) {
			var firstElement = Servers.getList()[0];
			Servers.setCurrentServer(firstElement);				
		}
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
	});

});
