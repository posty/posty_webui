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
	
  	/* Services */

	var app = angular.module('postySoft.services', []);  
  
	app.value('version', '0.2');	

	/**
	* central page-service. stores the actual page-title
	*
	* @class Page
	*/
	app.factory('Page', function(){						
		var title = 'default';
		return {
			title: function() {	    	
				return title;
			},

			setTitle: function(newTitle) { 
				title = newTitle; 
			}
		};
	});

	/**
	* central alert-service. stores a list of alerts (type and message)
	*
	* @class AlertService
	*/
	app.factory('AlertService', ['$timeout', function($timeout){  
		var alerts = [];
		var DELETE_ALERT_INTERVAL = 10000; // Time in ms when an Alert will be dropped out of the List

		/**
		* pops the first element out of the alert-list
		*
		* @method popFirst		
		*/
		var popFirst = function(){
	        alerts.splice(0, 1);
	    }    

		return {
			/**
			* add an alert to the service
			* and sets an timeout that removes the alert out of the alert-list
			*
			* @method addAlert		
			* @param type {String} the type of the message (info, error, confirmation) 
			* @param msg {String} the message-text
			*/		
			addAlert: function(type, msg) {                
				var element = alerts.push({'type': type, 'msg': msg});                				
				$timeout(popFirst,DELETE_ALERT_INTERVAL);
			},

			/**
			* closes an alert by index of the alert-list
			*
			* @method closeAlert		
			* @param index {int} index of the element which should be closed		
			*/		
			closeAlert: function(index) {
				alerts.splice(index, 1);
			},

			/**
			* clears the alert-list
			*
			* @method clearAlerts				
			*/	
			clearAlerts: function() {
				alerts = [];
			},

			/**
			* refers the alert-list
			*
			* @method alerts
			* @return {Array} the list of all alerts
			*/			
			alerts: function() {				
				return alerts; 
			}	
		};
	}]);

	app.service('ModalService', ['$modal', function ($modal) {

	        var modalDefaults = {
	            backdrop: true,
	            keyboard: false,
	            modalFade: true,
	            templateUrl: 'partials/partial_modal.html',
				resolve: {
					data: function () {
						return null;
					}
				}            
	        };

	        var modalOptions = {
	            closeButtonText: 'Cancel',
	            actionButtonText: 'Save',
	            headerText: '',
	            bodyText: ''
	        };

	        this.show = function (customModalDefaults, customModalOptions) {
	            //Create temp objects to work with since we're in a singleton service
	            var tempModalDefaults = {};
	            var tempModalOptions = {};

	            //Map angular-ui modal custom defaults to modal defaults defined in service
	            angular.extend(tempModalDefaults, modalDefaults, customModalDefaults);

	            //Map modal.html $scope custom properties to defaults defined in service
	            angular.extend(tempModalOptions, modalOptions, customModalOptions);

	            if (!tempModalDefaults.controller) {
	                tempModalDefaults.controller = function ($scope, $modalInstance, data) {
	                    $scope.modalOptions = tempModalOptions;
	                    $scope.data = data;
	                    $scope.modalOptions.ok = function (result) {                 	
	                        $modalInstance.close(result);
	                    };
	                    $scope.modalOptions.close = function (result) {
	                        $modalInstance.dismiss('cancel');
	                    };
	                }
	                //necessary for the minifier
	                tempModalDefaults.controller['$inject'] = ['$scope', '$modalInstance', 'data'];
	            }
	            return $modal.open(tempModalDefaults);
	        };
	}]);

	app.service('SelectDomainService', ['$modal', function ($modal) {
	    	var opened = false;

	        var modalDefaults = {
	            backdrop: true,
	            keyboard: false,
	            modalFade: true,
	            openJustOnce: true,
	            templateUrl: 'partials/partial_select_domain.html',
				resolve: {
					data: function () {
						return null;
					}
				},
				controller: function ($scope, $location, $modalInstance, data, Domains) {                    
                    $scope.data = data;
			        $scope.getList = function() {
			            return Domains.getList();
			        };                    
                    $scope.ok = function (result) {
                    	var domain = null;
                    	var list = Domains.getList();
                    	for (var i = 0; i < list.length; i++) {	
							if (list[i].name === result.name) {
								domain = list[i];
								break;
							}
						}
                        $modalInstance.close(domain);
                    };
                    $scope.close = function (result) {
                    	$location.path(""); // redirect to Dashboard
                        $modalInstance.dismiss('cancel');
                    };
	            }
	        };

	        //necessary for the minifier
            modalDefaults.controller['$inject'] = ['$scope', '$location', '$modalInstance', 'data', 'Domains'];

	        this.show = function () {  
	        	if (!modalDefaults.openJustOnce || (modalDefaults.openJustOnce && !opened)) {
	        		return $modal.open(modalDefaults);
	        	}                    	           	
	        };
	}]);

    /**
     * Servers
     *
     * @class Servers
     */
    app.factory('Servers', ['Restangular', function(Restangular) {
        var list = [];

        var DEFAULT_SERVER = {
        	url: "",
        	key: ""
        }; // const for the default-server

        var currentServer = DEFAULT_SERVER;

        return {
			/**
			* register observers for the currentDomain change event
			*
			* @method add
			* @param server {Object} server-Object
			*/			
			add: function(server) {											
				list.push(server);				
			},
			/**
			* unregister observers for the currentDomain change event
			*
			* @method remove
			* @param server {Object} server-Object
			*/			
			remove: function(server) {
				var index = list.indexOf(server);
				if (index > -1) {
					list.splice(index, 1);
				}
			}, 

			/**
			* returns the current server
			*
			* @method currentServer
			* @return {Object} Returns the current server
			*/
			currentServer: function() { 
				return currentServer; 
			},
			/**
			* sets the current server
			*
			* @method setCurrentServer	
			* @param value {Object} the new current server
			*/
			setCurrentServer: function(server) { 				
				if (server != currentServer) {					
					currentServer = server;						
					Restangular.setBaseUrl(server.url);									
					Restangular.setDefaultHeaders({auth_token: server.key});
				}		
			},			

            /**
             * get the list of all api-keys
             *
             * @method getList
             * @return {Array} Returns list-member
             */
            getList: function() {
                return list;
            },

			/**
             * more than one server is saved
             *
             * @method moreThanOneServer
             * @return {Boolean} Returns true if the there are more than one server saved
             */
            moreThanOneServer: function() {
                return list.length > 1;
            },

			/**
             * valid Server is set
             *
             * @method isValid
             * @return {Boolean} Returns true if the current Server is valid
             */
            isValid: function() {
            	console.log("aaa");
                return currentServer != null;
            }            
        };
    }]); 


	app.service('SelectServerService', ['$modal', function ($modal) {
	    	var opened = false;

	        var modalDefaults = {
	            backdrop: true,
	            keyboard: false,
	            modalFade: true,
	            openJustOnce: true,
	            templateUrl: 'partials/partial_select_server.html',
				resolve: {
					data: function () {
						return null;
					}
				},
				controller: function ($scope, $modalInstance, data, Servers) {                    
                    $scope.data = data;
			        $scope.getList = function() {
			            return Servers.getList();
			        };                    
                    $scope.ok = function (result) {                    	
                        $modalInstance.close(result);
                    };                    
	            }
	        };

	        //necessary for the minifier
            modalDefaults.controller['$inject'] = ['$scope', '$modalInstance', 'data', 'Servers'];

	        this.show = function () {  
	        	if (!modalDefaults.openJustOnce || (modalDefaults.openJustOnce && !opened)) {
	        		return $modal.open(modalDefaults);
	        	}                    	           	
	        };
	}]);

	function ProcessStack() { 

		this.DUMMY_PUSH_ELEMENT = true;
		this.processStack = [];	
		
		/**
		* pushes the process-stack
		*
		* @method register
		*/			
		this.register = function() { 			
			this.processStack.push(this.DUMMY_PUSH_ELEMENT);						
		};

		/**
		* pops an element fromt the process-stack
		*
		* @method unregister
		*/			
		this.unregister = function() { 			
			this.processStack.pop(); 						
		};

		/**
		* refers if the stack is full or not
		*
		* @method isLoading
		* @return {Boolean} true if the stack is not empty
		*/			
		this.isLoading = function() {
			return (this.processStack.length > 0); 
		}			
	}

	/**
	* central process-service. stores a stack for each "thread" which is performed
	*
	* @class ProcessService
	*/	
	app.factory('ProcessService', [function() {
		return new ProcessStack();
	}]);

	/**
	* central process-provider. delegates the functions to a ProcessServiceInstance
	*
	* @class ProcessServiceProvider
	*/
	app.provider('ProcessService', function ProcessServiceProvider() {
		var process = new ProcessStack();

		this.register = function() {
			process.register();
		};

		this.unregister = function() {
			process.unregister();
		};	  

		this.$get = [function ProcessServiceFactory() {
			return process;
		}];
	});


	/**
	* central alert-service. stores a list of alerts (type and message)
	*
	* @class AlertService
	*/
	app.service('ErrorService', [function() {  

		this.statusCode = 0;
		this.msg = "";
		this.occurred = false;
	
		/**
		* add an alert to the service
		* and sets an timeout that removes the alert out of the alert-list
		*
		* @method throw					
		*/		
		this.throw = function(statusCode, msg) {                				
			this.statusCode = statusCode;
			this.msg = msg;				
			this.occurred = true;
		};

		/**
		* closes an alert by index of the alert-list
		*
		* @method reset					
		*/		
		this.reset = function() {
			this.occurred = false;				
		};

		/**
		* clears the alert-list
		*
		* @method clearAlerts				
		*/	
		this.getStatusCode = function() {
			return this.statusCode;
		};

		/**
		* clears the alert-list
		*
		* @method clearAlerts				
		*/	
		this.getMessage = function() {
			return this.msg;
		};			
		/**
		* clears the alert-list
		*
		* @method clearAlerts				
		*/	
		this.occurred = function() {
			return this.occurred;
		};
		
	}]);	

    /**
     * ResponseHandler
     *
     * @class ResponseHandler
     */
    app.factory('ResponseHandler', ['ErrorService', '$location', function(ErrorService, $location) {
        var list = [];

        return {
			/**
			* adding responses to the local list
			*
			* @method add
			* @param response {Object} response-Object
			*/			
			add: function(response) {											
				list.push(response);				
				switch (response.status) {
				  case 401:
				  	ErrorService.throw("401", "Invalid API-Key");
				  	console.log(ErrorService);
				  	$location.path('/error');
				  	break;
				  case 404:
				    ErrorService.throw("404", "Ther Server is unreachable");
				    $location.path('/error');
				    break;				  
				}								
			}           
        };
    }]); 	

});
