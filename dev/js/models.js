/*!
 * posty_webUI
 *
 * Copyright 2014 posty-soft.org
 * Licensed under the LGPL v3
 * https://www.gnu.org/licenses/lgpl.html
 *
 */
define(['angular', 'restangular'], function (angular, Restangular) {
	'use strict';

	var app = angular.module('postySoft.models', ['postySoft.services']);

	/**
	* filters the error-messages of the response and returns the concated messages
	*
	* @method  @return {String} Returns the error-message
	*/
	var errorMsg = function(response) {
		var result = "";
		for(var prop in response) {			
		    if(response.hasOwnProperty(prop)) {
				result = result+". "+response[prop];
		    }
		}
		return result.substr(2, result.length)+".";		
	};	

	/**
	* central domain-model. Here you do all the CRUD-operations with the REST-API
	*
	* @class Domains
	*/
	app.factory('Domains', ['Restangular', 'AlertService', function(Restangular, AlertService) {
		var ALL_DOMAINS = {
			name: "all Domains"
		}; // const for the all-domain-selection

		var currentDomain = ALL_DOMAINS; // current Domain you have selected 	
		var list = []; // list of all domains		
		var realDataList = []; // list of all data before it is edited			
		var observerList = []; // observer for sitching the current-domain

		var notifyObservers = function() {
			for (var i = 0; i < observerList.length; i++) {	
				observerList[i].update();
			}
		};

		var containsObserver = function(observer) {
			for (var i = 0; i < observerList.length; i++) {		 						 		
		 		if (observerList[i].getName() === observer.getName()) {
		 			return true;		 			
		 		}				 						 		
	 		}
	 		return false;
		}

		var refresh = function() {
			list = [];			
			realDataList = [];
			var dao = Restangular.all('domains'); 
			dao.getList().then(function(data) {									
			 	for (var i = 0; i < data.length; i++) {	
			 		realDataList.push(angular.copy(data[i]));
			 		list.push(data[i].virtual_domain);			 		
			 	}													
			});		
		};	

		var oldDomainByID = function(id) {
		 	for (var i = 0; i < realDataList.length; i++) {		 						 		
		 		if (realDataList[i].virtual_domain.id == id) {
		 			return realDataList[i].virtual_domain;
		 		}				 						 		
		 	}			
		};
	  
		return {
			ALL_DOMAINS: ALL_DOMAINS,
			/**
			* returns if the domain is valid or not
			*
			* @method isValid
			* @param domain {Object} the domain
			* @return {Boolean} Returns true if the domain is valid	
			*/			
			isValid: function(domain) {
				return (domain && domain != ALL_DOMAINS);			
			},
			/**
			* returns if all domains are selected or not
			*
			* @method allDomainsSelected
			* @return {Boolean} Returns true if currentDomain == ALL_DOMAINS	
			*/		
			allDomainsSelected: function() { 
				return (currentDomain == ALL_DOMAINS); 
			},
			/**
			* returns the current domain
			*
			* @method currentDomain
			* @return {Object} Returns the current domain
			*/
			currentDomain: function() { 
				return currentDomain; 
			},
			/**
			* sets the current domain
			*
			* @method setCurrentDomain	
			* @param value {Object} the new current domain
			*/
			setCurrentDomain: function(value) { 				
				if (value != currentDomain) {
					currentDomain = value;									
					notifyObservers();							
				}		
			},
			/**
			* creates a new domain		
			*
			* @method createDomain		
			* @param domain {Object} the domain-object
			*/
			create: function(domain) {	
				var dao = Restangular.all('domains'); 
				dao.post(domain).then(function(response) {	
					var msg = "New domain created: "+domain.name;
					AlertService.addAlert("success",msg);					
					currentDomain = ALL_DOMAINS;												
					refresh();						
				}, function(response) {	
					var msg = "There was an error saving the domain "+domain.name+": \n"+errorMsg(response.data.error);
					AlertService.addAlert("danger",msg);					
				});			
			},
			/**
			* edit a existing domain
			*
			* @method edit		
			* @param domain {Object} the domain-object
			*/
			edit: function(domain) {
				var oldDomain = oldDomainByID(domain.id);
				var dao = Restangular.one('domains',oldDomain.name);
				dao.name = domain.name;
				dao.put().then(function(response) {
					var msg = "Domain "+domain.name+" updated!";
					AlertService.addAlert("success",msg);
					refresh();
				}, function(response) {
					var msg = "There was an error updating the domain "+domain.name+": \n"+errorMsg(response.data.error);
					AlertService.addAlert("danger",msg);
					refresh();
				});
			},
			/**
			* remove a existing domain
			*
			* @method removeDomain		
			* @param domain {Object} the domain-object
			*/
			remove: function(domain) {				
				var dao = Restangular.one('domains',domain.name);		
				dao.remove().then(function(response) {							
					var msg = "Domain "+domain.name+" deleted!";
					AlertService.addAlert("success",msg);					
					if (domain == currentDomain)
						currentDomain = ALL_DOMAINS;	
					refresh();									
				}, function(response) {				
					var msg = "There was an error deleting the domain "+domain.name+": \n"+errorMsg(response.data.error);
					AlertService.addAlert("danger",msg);					
				});				
			},						
			/**
			* get the list of all domains		
			*
			* @method getlist		
			* @return {Array} Returns the list-member
			*/
			getList: function() {				
				return list;	
			},
			/**
			* refreshes the List
			*
			* @method refreshList
			*/
			refresh: function() {
				refresh();
			},
			/**
			* register observers for the currentDomain change event
			*
			* @method registerCurrentDommainObserver
			* @param observer {Object} observer-Objecter with update-Method
			*/			
			registerCurrentDomainObserver: function(observer) {							
				if (!containsObserver(observer)) {
					observerList.push(observer);
				}												
			},
			/**
			* unregister observers for the currentDomain change event
			*
			* @method unregisterCurrentDommainObserver
			* @param observer {Object} observer-Objecter with update-Method
			*/			
			unregisterCurrentDomainObserver: function(observer) {
				var index = observerList.indexOf(observer);
				if (index > -1) {
					observerList.splice(index, 1);
				}
			}
		};
	}]);

	/**
	* central DomainAliasses-model. Here you do all the CRUD-operations with the REST-API
	*
	* @class DomainAliasses
	*/
	app.factory('DomainAliasses', ['Restangular', 'AlertService', 'Domains', function(Restangular, AlertService, Domains) {
		var list = [];	// list of all aliases

		var domain = null;	
		
		var refresh = function() {
			list = [];			
			if (Domains.isValid(domain)) {  												
				Restangular.one('domains',domain.name).all('aliases').getList().then(function(data) {										 	
				 	for (var i = 0; i < data.length; i++) {				 					 		
				 		list.push(data[i].virtual_domain_alias);				 						 						 				 		
				 	}					 																		
				});				
			}			
		};	

		return {
            /**
             * set the domain
             *
             * @method setDomain
             * @param newDomain {Object} the domain object
             */
            setDomain: function(newDomain) {
				if (domain != newDomain) {
					domain = newDomain;
				}
			},
            /**
             * get the domain
             *
             * @method getDomain
             */
			getDomain: function () {
				return domain;
			},
			/**
			* creates an new domain-alias
			*
			* @method create
			* @param alias {Object} the alias object			
			*/			
			create: function(alias) {
				var dao = Restangular.one('domains',domain.name).all('aliases');				
				dao.post(alias).then(function(response) {	
					var msg = "New domain alias created: "+alias.name;
					AlertService.addAlert("success",msg);
					refresh();
				}, function(response) {	
					var msg = "There was an error saving the domain alias "+alias.name+": \n"+errorMsg(response.data.error);
					AlertService.addAlert("danger",msg); 						
				});							
			},
			/**
			* remove an existing alias
			*
			* @method remove
			* @param alias {Object} the alias object			
			*/
			remove: function(alias) {													
				var dao = Restangular.one('domains',domain.name).one('aliases', alias.name);
				dao.remove().then(function(response) {							
					var msg = "Domain alias "+alias.name+" deleted!";
					AlertService.addAlert("success",msg);					
					refresh();
				}, function(response) {
					var msg = "There was an error deleting the domain alias "+alias.name+": \n"+errorMsg(response.data.error);
					AlertService.addAlert("danger",msg);					
				});		
			},
			/**
			* get the list of all aliases		
			*
			* @method getList		
			* @return {Array} Returns the list-member
			*/
			getList: function() {		
				return list;	
			},
			/**
			* refreshes the list
			*
			* @method refresh
			*/				
			refresh: function() {			
				refresh();
			}
		};
	}]);

    /**
     * central Transport-model. Here you do all the CRUD-operations with the REST-API
     *
     * @class Transports
     */
    app.factory('Transports', ['Restangular', 'AlertService', function(Restangular, AlertService) {
        var list = [];	// list of all transports
        var realDataList = []; // list of all data before it is edited

        var refresh = function() {
            list = [];
            realDataList = [];
            Restangular.all('transports').getList().then(function(data) {
                for (var i = 0; i < data.length; i++) {
                    realDataList.push(angular.copy(data[i]));
                    list.push(data[i].virtual_transport);
                }
            });
        };

        var oldItemByID = function(id) {
            for (var i = 0; i < realDataList.length; i++) {
                if (realDataList[i].virtual_transport.id == id) {
                    return realDataList[i].virtual_transport;
                }
            }
        };

        return {
            /**
             * creates an new transport
             *
             * @method create
             * @param transport {Object} the transport object
             */
            create: function(transport) {
                var dao = Restangular.all('transports');
                dao.post(transport).then(function(response) {
                    var msg = "New transport created: "+transport.name;
                    AlertService.addAlert("success",msg);
                    refresh();
                }, function(response) {
                    var msg = "There was an error saving the transport "+transport.name+": \n"+errorMsg(response.data.error);
                    AlertService.addAlert("danger",msg);
                });
            },
            /**
             * edit a existing tranpsort
             *
             * @method edit
             * @param transport {Object} the transport object
             */
            edit: function(transport) {
                var oldItem = oldItemByID(transport.id);
                var dao = Restangular.one('transports',oldItem.name);
                dao.name = transport.name;
                dao.destination = transport.destination;
                dao.put().then(function(response) {
                    var msg = "Transport "+transport.name+" updated!";
                    AlertService.addAlert("success",msg);
                    refresh();
                }, function(response) {
                    var msg = "There was an error updating the transport "+transport.name+": \n"+errorMsg(response.data.error);
                    AlertService.addAlert("danger",msg);
                    refresh();
                });
            },
            /**
             * remove an existing transport
             *
             * @method remove
             * @param alias {Object} the alias object
             */
            remove: function(transport) {
                var dao = Restangular.one('transports', transport.name);
                dao.remove().then(function(response) {
                    var msg = "Transport "+transport.name+" deleted!";
                    AlertService.addAlert("success",msg);
                    refresh();
                }, function(response) {
                    var msg = "There was an error deleting the transport "+transport.name+": \n"+errorMsg(response.data.error);
                    AlertService.addAlert("danger",msg);
                });
            },
            /**
             * get the list of all transports
             *
             * @method getList
             * @return {Array} Returns the aliasList-member
             */
            getList: function() {
                return list;
            },
            /**
             * refreshes the list
             *
             * @method refresh
             */
            refresh: function() {
                refresh();
            }
        };
    }]);

    /**
     * central Transport-model. Here you do all the CRUD-operations with the REST-API
     *
     * @class Transports
     */
    app.factory('Users', ['Restangular', 'AlertService', 'Domains', function(Restangular, AlertService, Domains) {
        var list = [];	// list of all users
        var realDataList = []; // list of all data before it is edited
        var domain = null;

        var refresh = function() {
            list = [];
            realDataList = [];
            if (Domains.isValid(domain)) {            
                Restangular.one('domains',domain.name).all('users').getList().then(function(data) {
                    for (var i = 0; i < data.length; i++) {
                        realDataList.push(angular.copy(data[i]));
                        list.push(data[i].virtual_user);
                    }
                });
            }
        };

        var oldItemByID = function(id) {
            for (var i = 0; i < realDataList.length; i++) {
                if (realDataList[i].virtual_user.id == id) {
                    return realDataList[i].virtual_user;
                }
            }
        };

        return {
			/**
			* returns if the user is valid or not
			*
			* @method isValid
			* @param user {Object} the user
			* @return {Boolean} Returns true if the user is valid	
			*/			
			isValid: function(user) {
				return (user != null);			
			},        	
            /**
             * set the domain
             *
             * @method setDomain
             * @param newDomain {Object} the domain object
             */
            setDomain: function(newDomain) {
                if (domain != newDomain) {
                    domain = newDomain;
                }
            },
            /**
             * get the domain
             *
             * @method getDomain
             */
            getDomain: function () {
                return domain;
            },
            /**
             * creates an new user
             *
             * @method create
             * @param user {Object} the user object
             */
            create: function(user) {
                var dao = Restangular.one('domains',domain.name).all('users');
                dao.post(user).then(function(response) {
                    var msg = "New user created: "+user.name;
                    AlertService.addAlert("success",msg);
                    refresh();
                }, function(response) {
                    var msg = "There was an error saving the user "+user.name+": \n"+errorMsg(response.data.error);
                    AlertService.addAlert("danger",msg);
                });
            },
            /**
             * edit a existing user
             *
             * @method edit
             * @param user {Object} the user object
             */
            edit: function(user) {
                var oldItem = oldItemByID(user.id);
                var dao = Restangular.one('domains',domain.name).one('users',oldItem.name);
                dao.name = user.name;
                dao.quota = user.quota;
                if (user.password != dao.password)
                    dao.password = user.password;
                dao.put().then(function(response) {
                    var msg = "User "+user.name+" updated!";
                    AlertService.addAlert("success",msg);
                    refresh();
                }, function(response) {
                    var msg = "There was an error updating the user "+user.name+": \n"+errorMsg(response.data.error);
                    AlertService.addAlert("danger",msg);
                    refresh();
                });
            },
            /**
             * remove an existing user
             *
             * @method remove
             * @param alias {Object} the user object
             */
            remove: function(user) {
                var dao = Restangular.one('domains',domain.name).one('users',user.name);
                dao.remove().then(function(response) {
                    var msg = "User "+user.name+" deleted!";
                    AlertService.addAlert("success",msg);
                    refresh();
                }, function(response) {
                    var msg = "There was an error deleting the user "+user.name+": \n"+errorMsg(response.data.error);
                    AlertService.addAlert("danger",msg);
                });
            },
            /**
             * get the list of all userers
             *
             * @method getList
             * @return {Array} Returns the aliasList-member
             */
            getList: function() {
                return list;
            },
            /**
             * refreshes the list
             *
             * @method refresh
             */
            refresh: function() {
                refresh();
            }
        };
    }]);

	/**
	* central UserAliasses-model. Here you do all the CRUD-operations with the REST-API
	*
	* @class UserAliasses
	*/
	app.factory('UserAliasses', ['Restangular', 'AlertService', 'Domains', 'Users', function(Restangular, AlertService, Domains, Users) {
		var list = [];	// list of all aliases
		var domain = null;	
		var user = null;
		
		var refresh = function() {
			list = [];	
			if (Domains.isValid(domain) && Users.isValid(user)) { 
				Restangular.one('domains',domain.name).one('users',user.name).all('aliases').getList().then(function(data) {									 	
				 	for (var i = 0; i < data.length; i++) {				 					 		
				 		list.push(data[i].virtual_user_alias);				 						 						 				 		
				 	}					 																		
				});				
			}			
		};	

		return {
            /**
             * set the domain
             *
             * @method setDomain
             * @param newDomain {Object} the domain object
             */
            setDomain: function(newDomain) {
				if (domain != newDomain) {
					domain = newDomain;
				}
			},
            /**
             * get the domain
             *
             * @method getDomain
             */
			getDomain: function () {
				return domain;
			},
            /**
             * set the user
             *
             * @method setUser
             * @param newUser {Object} the user object
             */
            setUser: function(newUser) {
				if (user != newUser) {
					user = newUser;
				}
			},
            /**
             * get the user
             *
             * @method getUser
             */
			getUser: function () {
				return user;
			},			
			/**
			* creates an new user-alias
			*
			* @method create
			* @param alias {Object} the alias object			
			*/			
			create: function(alias) {						
				var dao = Restangular.one('domains',domain.name).one('users',user.name).all('aliases');
				dao.post(alias).then(function(response) {	
					var msg = "New user alias created: "+alias.name;
					AlertService.addAlert("success",msg);
					refresh();
				}, function(response) {	
					var msg = "There was an error saving the user alias "+alias.name+": \n"+errorMsg(response.data.error);
					AlertService.addAlert("danger",msg); 						
				});							
			},
			/**
			* remove an existing alias
			*
			* @method remove
			* @param alias {Object} the alias object			
			*/
			remove: function(alias) {																	
				var dao = Restangular.one('domains',domain.name).one('users',user.name).one('aliases', alias.name);
				dao.remove().then(function(response) {							
					var msg = "User alias "+alias.name+" deleted!";
					AlertService.addAlert("success",msg);					
					refresh();
				}, function(response) {
					var msg = "There was an error deleting the user alias "+alias.name+": \n"+errorMsg(response.data.error);
					AlertService.addAlert("danger",msg);					
				});		
			},
			/**
			* get the list of all aliases		
			*
			* @method getList		
			* @return {Array} Returns the list-member
			*/
			getList: function() {		
				return list;	
			},
			/**
			* refreshes the list
			*
			* @method refresh
			*/				
			refresh: function() {			
				refresh();
			}
		};
	}]);

	/**
	* central Summaries-model. Here you do all the CRUD-operations with the REST-API
	*
	* @class Summaries
	*/
	app.factory('Summaries', ['Restangular', function(Restangular) {
		var list = [];
		
		var refresh = function() {			
			list = [];		
			Restangular.all('summary').getList().then(function(items) {	
				angular.forEach(items, function(item){
				 	var data = new Object;
				 	data.value = item.count;
					data.percent = item.count;
				 	data.name = item.name;
				 	data.caption = item.name+": "+item.count.toFixed(0);
					list.push(data);					
				});	 			 						
			});			
		};	

		return {
			/**
			* get the list of all summary-entries		
			*
			* @method getList		
			* @return {Array} Returns the list-member
			*/
			getList: function() {		
				return list;	
			},
			/**
			* refreshes the list
			*
			* @method refresh
			*/				
			refresh: function() {			
				refresh();
			}
		};
	}]);

    /**
     * central ApiKeys-model. Here you do all the CRUD-operations with the REST-API
     *
     * @class ApiKeys
     */
    app.factory('ApiKeys', ['Restangular', 'AlertService', function(Restangular, AlertService) {
        var list = [];	// list of all api-keys
        var realDataList = []; // list of all data before it is edited

        var refresh = function() {
            list = [];
            realDataList = [];
            Restangular.all('api_keys').getList().then(function(data) {
                for (var i = 0; i < data.length; i++) {
                    realDataList.push(angular.copy(data[i]));
                    list.push(data[i].api_key);
                }
            });
        };

        var oldItemByID = function(id) {
            for (var i = 0; i < realDataList.length; i++) {
                if (realDataList[i].api_key.id == id) {
                    return realDataList[i].api_key;
                }
            }
        };

        return {
            /**
             * creates an new api-key
             *
             * @method create
             * @param apiKey {Object} the api-key object
             */
            create: function(apiKey) {
                var dao = Restangular.all('api_keys');
                dao.post(apiKey).then(function(response) {
                    var msg = "New api-key created: "+response.apiKey.access_token;
                    AlertService.addAlert("success",msg);
                    refresh();
                }, function(response) {
                    var msg = "There was an error saving the api-key "+response.apiKey.access_token+": \n"+errorMsg(response.data.error);
                    AlertService.addAlert("danger",msg);
                });
            },
            /**
             * edit a existing api-key
             *
             * @method edit
             * @param apiKey {Object} the api-key object
             */
            edit: function(apiKey) {
                var dao = Restangular.one('api_keys',apiKey.access_token);
				dao.expires_at = apiKey.expires_at;		
				dao.active =  Number(apiKey.active);
                dao.put().then(function(response) {
                    var msg = "Api-key "+apiKey.access_token+" updated!";
                    AlertService.addAlert("success",msg);
                    refresh();
                }, function(response) {
                    var msg = "There was an error updating the api-key "+apiKey.access_token+": \n"+errorMsg(response.data.error);
                    AlertService.addAlert("danger",msg);
                    refresh();
                });
            },
            /**
             * remove an existing api-key
             *
             * @method remove
             * @param apiKey {Object} the api-key object
             */
            remove: function(apiKey) {
                var dao = Restangular.one('api_keys', apiKey.access_token);
                dao.remove().then(function(response) {
                    var msg = "Api-key "+apiKey.access_token+" deleted!";
                    AlertService.addAlert("success",msg);
                    refresh();
                }, function(response) {
                    var msg = "There was an error deleting the api-key "+apiKey.access_token+": \n"+errorMsg(response.data.error);
                    AlertService.addAlert("danger",msg);
                });
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
             * refreshes the list
             *
             * @method refresh
             */
            refresh: function() {
                refresh();
            },
            /**
             * check if the api-key is expired
             *
             * @method isExpired
             * @param apiKey {Object} the api-key object
             */
            isExpired: function(apiKey) {
            	var today = new Date();
            	var date = new Date(apiKey.expires_at);	
            	return date-today<0;
            }
        };
    }]);	

});