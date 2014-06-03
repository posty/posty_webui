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

	/* Controllers */
	
	var app = angular.module('postySoft.controllers', ['postySoft.services', 'postySoft.configurations', 'ui.bootstrap']);
	
	
	/**
	* main-view-controller. first controller which will be instanced 
	*
	* @class MainCtrl
	*/		
	app.controller('MainCtrl', ['$scope', '$rootScope', 'Page', 'Domains', 'ProcessService' ,'AlertService', 'CONFIGS', function ($scope, $rootScope, Page, Domains, ProcessService, AlertService, CONFIGS) {

		$rootScope.init = function() {
            Domains.refresh();
			$scope = $rootScope;
			$scope.Page = Page;
			$scope.ProcessService = ProcessService;
            $scope.AlertService = AlertService;
            $scope.CONFIGS = CONFIGS;
		};					
	}]);

	/**
	* view-controller for the process-service
	*
	* @class ProcessCtrl
	*/
	app.controller('ProcessCtrl', ['$scope', 'ProcessService', function ($scope, ProcessService) {				
	}]);

	/**
	* view-controller for the alert-service
	*
	* @class AlertCtrl
	*/
	app.controller('AlertCtrl', ['$scope', 'AlertService', function ($scope, AlertService) {				
	}]);
			
	/**
	* view-controller for the dashboard
	*
	* @class DashboardCtrl
	*/
	app.controller('DashboardCtrl', ['$scope', 'Page', function ($scope, Page) {
		Page.setTitle('Dashboard');						
	}]);

	/**
	* view-controller for the navbar
	*
	* @class NavBarCtrl
	*/
	app.controller('NavBarCtrl', ['$scope', 'Domains', function ($scope, Domains) {
		$scope.getDomainList = function() {		
			return Domains.getList();
		};

		$scope.getCurrentDomain = function() {		
			return Domains.currentDomain();
		};

        $scope.setCurrentDomainToAll = function() {
            return Domains.setCurrentDomain(Domains.ALL_DOMAINS);
        };

		$scope.setCurrentDomain = function(domain) {		
			return Domains.setCurrentDomain(domain);
		};										
	}]);				

	/**
	* Message-Class to transfer data between the domain-Ctrl
	*
	* @class DomainData
	*/
	app.factory('DomainData', function() {
		return {domain: null};
	});		

	/**
	* view-controller for the domains
	*
	* @class DomainCtrl
	*/
	app.controller('DomainCtrl', ['$scope', 'ModalService', 'Page', 'Domains', 'DomainData', function ($scope, ModalService, Page, Domains, DomainData) {
		/**
		* initialises the controller-data
		*
		* @method init	
		*/	
		$scope.init = function() {		
			Page.setTitle('Domain');									
		};

        /**
         * get the domain List
         *
         * @method getList
         */
		$scope.getList = function() {	
			if (!Domains.allDomainsSelected()) {
				var list = [];
				list.push(Domains.currentDomain());
				return list;
			} else {					
				return Domains.getList();
			}
		};				

		/**
		* create a new domain
		*
		* @method create				
		*/		
		$scope.create = function() {				
			var modalDefaults = {					
				templateUrl: 'createView.html',
				resolve: {
					data: function () {
						return { name: "" };
					}
				}  									
			};				
	        var modalInstance = ModalService.show(modalDefaults, {});
			modalInstance.result.then(function (data) {	
				var item = {name: data.name};
                Domains.create(item);
			});				
		};
		
		/**
		* edit an existing domain
		*
		* @method edit	
		* @param domain {Object} domain-object
		*/		
		$scope.edit = function(domain) {				
			DomainData.domain = domain;			
			var modalDefaults = {					
				templateUrl: 'editView.html',
				resolve: {
					data: function () {
						return { domain: domain };
					}
				}  									
			};					
			var modalOptions = {
				activeTab: 'general',							
	            tabClick: function (type) {
	            	this.activeTab = type;			            	
	            }
	        };			
	        var modalInstance = ModalService.show(modalDefaults, modalOptions);
			modalInstance.result.then(function (data) {
                Domains.edit(data.domain);
			});		
		};	

		/**
		* remove an existing domain
		*
		* @method remove	
		* @param domain {Object} domain-object
		*/	
		$scope.remove = function(domain) {	
	        var modalOptions = {		            
	            actionButtonText: 'Confirm',
	            headerText: 'Delete domain?',
	            bodyText: 'Are you sure you want to delete the domain "'+domain.name+'"?'
	        };
	        var modalInstance = ModalService.show({}, modalOptions);
			modalInstance.result.then(function (data) {
                Domains.remove(domain);
			});
		};								
	}]);
	
	app.controller('DomainAliasCtrl', ['$scope', 'DomainAliasses', 'DomainData', function ($scope, DomainAliasses, DomainData) {

		var emptyView = function() {
			$scope.alias = {
				name: ""
			};
		}			

		/**
		* initialises the controller-data
		*
		* @method init	
		*/	
		$scope.init = function() {
            DomainAliasses.setDomain(DomainData.domain);
            DomainAliasses.refresh();
			emptyView();
		};

		$scope.getList = function() {		
			return DomainAliasses.getList();
		};				

		/**
		* create a new alias
		*
		* @method create	
		* @param domain {Object} alais-object			
		*/		
		$scope.create = function(alias) {
            DomainAliasses.create(alias);
			emptyView();
		};	

		/**
		* remove an existing alias
		*
		* @method remove	
		* @param alias {Object} alias-object
		*/	
		$scope.remove = function(alias) {
            DomainAliasses.remove(alias);
		};
	}]);

    /**
     * view-controller for the transports
     *
     * @class TransportCtrl
     */
    app.controller('TransportCtrl', ['$scope', 'ModalService', 'Page', 'Transports', function ($scope, ModalService, Page, Transports) {
        /**
         * initialises the controller-data
         *
         * @method init
         */
        $scope.init = function() {
            Page.setTitle('Transport');
            Transports.refresh();
        };

        /**
         * get the transport List
         *
         * @method getList
         */
        $scope.getList = function() {
            return Transports.getList();
        };

        /**
         * create a new transport
         *
         * @method create
         */
        $scope.create = function() {
            var modalDefaults = {
                templateUrl: 'createView.html',
                resolve: {
                    data: function () {
                        return {
                            name: "",
                            destination: ""
                        };
                    }
                }
            };
            var modalInstance = ModalService.show(modalDefaults, {});
            modalInstance.result.then(function (data) {
                var item = {
                    name: data.name,
                    destination: data.destination
                };
                Transports.create(item);
            });
        };

        /**
         * edit an existing transport
         *
         * @method edit
         * @param transport {Object} transport-object
         */
        $scope.edit = function(transport) {
            var modalDefaults = {
                templateUrl: 'editView.html',
                resolve: {
                    data: function () {
                        return transport;
                    }
                }
            };
            var modalOptions = {};
            var modalInstance = ModalService.show(modalDefaults, modalOptions);
            modalInstance.result.then(function (data) {
                Transports.edit(data);
            });
        };

        /**
         * remove an existing transport
         *
         * @method remove
         * @param domain {Object} transport-object
         */
        $scope.remove = function(transport) {
            var modalOptions = {
                actionButtonText: 'Confirm',
                headerText: 'Delete transport?',
                bodyText: 'Are you sure you want to delete the transport "'+transport.name+'"?'
            };
            var modalInstance = ModalService.show({}, modalOptions);
            modalInstance.result.then(function (data) {
                Transports.remove(transport);
            });
        };
    }]);

    /**
    * Message-Class to transfer data between the user-Ctrl
    *
    * @class UserData
    */
    app.factory('UserData', function() {
        return {
            domain: null,
            user: null
        };
    });

    /**
     * view-controller for the user
     *
     * @class UserCtrl
     */
    app.controller('UserCtrl', ['$scope', 'SelectDomainService', 'ModalService', 'Page', 'Users', 'Domains', 'UserData',  function ($scope, SelectDomainService, ModalService, Page, Users, Domains, UserData) {

        var currentDomainChange = function() {
            if (Domains.currentDomain() === Domains.ALL_DOMAINS) {
                var selectDomain = SelectDomainService.show();
                selectDomain.result.then(function (domain) {               
                    Domains.setCurrentDomain(domain);
                });
            }
            Users.setDomain(Domains.currentDomain());
            Users.refresh();
        } 

        var observer = {
            update: currentDomainChange,
            getName: function() {
               return "UserCtrl";
            }
        }
        /**
         * initialises the controller-data
         *
         * @method init
         */
        $scope.init = function() {
            Page.setTitle('User');
            currentDomainChange();                        
            Domains.registerCurrentDomainObserver(observer);
         };

        /**
         * destroys the controller-data
         *
         * @method onDestroy
         */
        $scope.$on('$destroy', function() {
            Domains.unregisterCurrentDomainObserver(observer);
        });

        /**
         * get the user List
         *
         * @method getList
         */
        $scope.getList = function() {
            return Users.getList();
        };

        /**
         * get the current domain
         *
         * @method getList
         */
        $scope.getDomain = function() {
            return Domains.currentDomain();
        };

        /**
         * create a new domain
         *
         * @method create
         */
        $scope.create = function() {
            var modalDefaults = {
                templateUrl: 'createView.html',
                resolve: {
                    data: function () {
                        return {
                            user: null,
                            domain: Domains.currentDomain()
                        };
                    }
                }
            };
            var modalInstance = ModalService.show(modalDefaults, {});
            modalInstance.result.then(function (data) {               
                var item = {
                    name: data.user.name,
                    password: data.user.password,
                    quota: data.user.quota * 1024 * 1024
                };
                Users.create(item);                
            });
        };

        /**
         * edit an existing user
         *
         * @method edit
         * @param user {Object} user-object
         */
        $scope.edit = function(user) {
            UserData.domain = Domains.currentDomain();
            UserData.user = user;
            var modalDefaults = {
                templateUrl: 'editView.html',
                resolve: {
                    data: function () {
                        return {
                            user: UserData.user,
                            domain: UserData.domain
                        };
                    }
                }
            };
            var modalOptions = {
                activeTab: 'general',
                tabClick: function (type) {
                    this.activeTab = type;
                },
                passwordChanged: false,
                newPasswordKeyPress: function(password) {
                    this.passwordChanged = (password != '');
                }
            };
            var modalInstance = ModalService.show(modalDefaults, modalOptions);
            modalInstance.result.then(function (data) {
                Users.edit(data.user);
            });
        };

        /**
         * remove an existing user
         *
         * @method remove
         * @param user {Object} user-object
         */
        $scope.remove = function(user) {
            var modalOptions = {
                actionButtonText: 'Confirm',
                headerText: 'Delete user?',
                bodyText: 'Are you sure you want to delete the user "'+user.name+'"?'
            };
            var modalInstance = ModalService.show({}, modalOptions);
            modalInstance.result.then(function (data) {
                Users.remove(user);
            });
        };
    }]);

    /**
     * view-controller for the user-aliasses
     *
     * @class UserAliasCtrl
     */
    app.controller('UserAliasCtrl', ['$scope', 'UserAliasses', 'UserData', function ($scope, UserAliasses, UserData) {

        var emptyView = function() {
            $scope.alias = {
                name: ""
            };
        }           

        /**
        * initialises the controller-data
        *
        * @method init  
        */  
        $scope.init = function() {
            UserAliasses.setDomain(UserData.domain);
            UserAliasses.setUser(UserData.user);
            UserAliasses.refresh();
            emptyView();
        };

        $scope.getList = function() {       
            return UserAliasses.getList();
        };              

        /**
        * create a new alias
        *
        * @method create    
        * @param domain {Object} alais-object           
        */      
        $scope.create = function(alias) {
            UserAliasses.create(alias);
            emptyView();
        };  

        /**
        * remove an existing alias
        *
        * @method remove    
        * @param alias {Object} alias-object
        */  
        $scope.remove = function(alias) {
            UserAliasses.remove(alias);
        };
    }]);

    /**
     * view-controller for the summary
     *
     * @class SummaryCtrl
     */
    app.controller('SummaryCtrl', ['$scope', 'Page', 'Summaries', function ($scope, Page, Summaries) {
        /**
        * initialises the controller-data
        *
        * @method init  
        */  
        $scope.init = function() {      
            Page.setTitle('Summary');       
            Summaries.refresh();              
        };

        $scope.getList = function() {       
            return Summaries.getList();
        };         
    }]);

    /**
     * view-controller for the api-keys
     *
     * @class ApiKeyCtrl
     */
    app.controller('ApiKeyCtrl', ['$scope', 'ModalService', 'Page', 'ApiKeys', function ($scope, ModalService, Page, ApiKeys) {
        /**
         * initialises the controller-data
         *
         * @method init
         */
        $scope.init = function() {
            Page.setTitle('ApiKey');
            ApiKeys.refresh();
        };

        /**
         * get the api-key List
         *
         * @method getList
         */
        $scope.getList = function() {
            return ApiKeys.getList();
        };

        /**
         * create a new api-key
         *
         * @method create
         */
        $scope.create = function() {
            var modalDefaults = {
                templateUrl: 'createView.html',
                resolve: {
                    data: function () {
                        return {
                            name: "",
                            destination: ""
                        };
                    }
                }
            };
            var modalInstance = ModalService.show(modalDefaults, {});
            modalInstance.result.then(function (data) {
                var item = {
                    //name: data.name,
                    //destination: data.destination
                };
                ApiKeys.create(item);
            });
        };

        /**
         * edit an existing api-key
         *
         * @method edit
         * @param apiKey {Object} api-key-object
         */
        $scope.edit = function(apiKey) {
            var modalDefaults = {
                templateUrl: 'editView.html',
                resolve: {
                    data: function () {
                        return apiKey;
                    }
                }
            };
            var modalOptions = {};
            var modalInstance = ModalService.show(modalDefaults, modalOptions);
            modalInstance.result.then(function (data) {
                ApiKeys.edit(data);
            });
        };

        /**
         * remove an existing api-key
         *
         * @method remove
         * @param apiKey {Object} api-key-object
         */
        $scope.remove = function(apiKey) {
            var modalOptions = {
                actionButtonText: 'Confirm',
                headerText: 'Delete api-key?',
                bodyText: 'Are you sure you want to delete the api-key "'+apiKey.access_token+'"?'
            };
            var modalInstance = ModalService.show({}, modalOptions);
            modalInstance.result.then(function (data) {
                ApiKeys.remove(apiKey);
            });
        };
    }]);

    // Sample controller where service is being used
    app.controller('TestCtrl', ['$scope', '$modal', 'version', function ($scope, $modal, version) {          
      

      

      $scope.open = function($event) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.opened = true;
      };

      $scope.dateOptions = {
        formatYear: 'yy',
        startingDay: 1
      };

      $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
      $scope.format = $scope.formats[0];
    }]);

    /*
	// Sample controller where service is being used
	app.controller('MyCtrl1', ['$scope', '$modal', 'version', function ($scope, $modal, version) {			

	}]);
	// More involved example where controller is required from an external file
	app.controller('MyCtrl2', ['$scope', '$injector', function($scope, $injector) {
		require(['controllers/myctrl2'], function(myctrl2) {
			// injector method takes an array of modules as the first argument
			// if you want your controller to be able to use components from
			// any of your other modules, make sure you include it together with 'ng'
			// Furthermore we need to pass on the $scope as it's unique to this controller
			$injector.invoke(myctrl2, this, {'$scope': $scope});
		});
	}]);
    */
});