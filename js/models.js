'use strict';

var app = angular.module('postySoft.models', []);

/**
* filters the error-messages of the response and returns the concated messages
*
* @method DomainService
' @return {String} Returns the error-message
*/
var errorMsg = function(response) {
	for(var prop in response) {
		var result = "";
	    if(response.hasOwnProperty(prop)) {
			result = result+". "+response[prop];
	    }
	}
	return result.substr(2, result.length)+".";		
};

/**
* central domain-model. Here you do all the CRUD-operations with the REST-API
*
* @class DomainService
*/
app.factory('DomainService', function(Restangular, ProcessService, AlertService){
	var ALL_DOMAINS = "all Domains"; // const for the all-domain-selection

	var currentDomain = ALL_DOMAINS; // current Domain you have selected 	
	var domainList = []; // list of all domains
	var domainListFiltered = []; // list of all filtered domains
	var onCurrentDomainChange; // event that will be caused by current domain change
	
	var refreshDomainList = function() {
			domainList = [];
			domainListFiltered = [];			
			ProcessService.register();
			Restangular.all('domains').getList().then(function(list) {	
				if (allDomainsSelected()) {
				 	for (var i = 0; i < list.length; i++) {
				 		domainList.push(list[i].virtual_domain);
				 		domainListFiltered.push(list[i].virtual_domain);		 		
				 	}						
				}
				else {					
				 	for (var i = 0; i < list.length; i++) {
				 		domainList.push(list[i].virtual_domain);
				 		if (list[i].virtual_domain.name == currentDomain) {
				 			domainListFiltered.push(list[i].virtual_domain);
				 		}				 						 		
				 	}					 					
				}							
				ProcessService.unregister();			
			});
	};	


	var allDomainsSelected = function() { 
			return (currentDomain == ALL_DOMAINS); 
	}; 
  
	return {
		/**
		* returns if all domains are selected or not
		*
		* @method allDomainsSelected
		* @return {Boolean} Returns true if currentDomain == ALL_DOMAINS	
		*/		
		allDomainsSelected: function() { 
			return allDomainsSelected(); 
		},

		/**
		* returns the current domain
		*
		* @method currentDomain
		* @return {String} Returns the current domain
		*/
		currentDomain: function() { 
			return currentDomain; 
		},	

		/**
		* sets the current domain
		*
		* @method setCurrenDomain	
		* @param value {String} the new current domain
		*/
		setCurrenDomain: function(value) { 
			if (value != currentDomain) {
				currentDomain = value;				
				refreshDomainList();
				if (onCurrentDomainChange != null)
					onCurrentDomainChange();							
			}		
		},

		/**
		* sets the event that will be caused by current domain change		
		*
		* @method setOnCurrentDomainChange		
		* @param value {function} the event-function
		*/
		setOnCurrentDomainChange: function(value) { 
			onCurrentDomainChange = value;	
		},		

		/**
		* creates a new domain		
		*
		* @method createDomain		
		* @param domainName {String} the name of the domain
		*/
		createDomain: function(domainName) {	
			ProcessService.register();		
			var dao = Restangular.all('domains');
			var newData = {name: domainName}; 		
			dao.post(newData).then(function(response) {	
				var msg = "New domain created: "+domainName;
				AlertService.addAlert("success",msg);
				console.log(msg);
				currentDomain = ALL_DOMAINS;								
				refreshDomainList();	
				ProcessService.unregister();					
			}, function(response) {	
				var msg = "There was an error saving the domain "+domainName+": \n"+errorMsg(response.data.error);
				AlertService.addAlert("error",msg);
				console.log(msg);	
				ProcessService.unregister();
			});			
		},

		/**
		* edit a existing domain		
		*
		* @method editDomain		
		* @param domainNameOld {String} the old name of the domain
		* @param domainNameNew {String} the new name of the domain
		*/
		editDomain: function(domainNameOld, domainNameNew) {			
			ProcessService.register();			
			var dao = Restangular.one('domains',domainNameOld);
			dao.name = domainNameNew;		
			dao.put().then(function(response) {							
				var msg = "Domain "+domainNameNew+" updated!";
				AlertService.addAlert("success",msg);
				console.log(msg);
				if (domainNameOld == currentDomain)
					currentDomain = domainNameNew;					
				refreshDomainList();				
				ProcessService.unregister();
			}, function(response) {		
				var msg = "There was an error updating the domain "+domainNameNew+": \n"+errorMsg(response.data.error);
				AlertService.addAlert("error",msg);
				console.log(msg);					
				ProcessService.unregister();
			});					
		},

		/**
		* remove a existing domain by name	
		*
		* @method removeDomain		
		* @param domainName {String} the name of the domain	
		*/
		removeDomain: function(domainName) {			
			ProcessService.register();			
			var dao = Restangular.one('domains',domainName);		
			dao.remove().then(function(response) {							
				var msg = "Domain "+domainName+" deleted!";
				AlertService.addAlert("success",msg);
				console.log(msg);
				if (domainName == currentDomain)
					currentDomain = ALL_DOMAINS;	
				refreshDomainList();	
				ProcessService.unregister();			
			}, function(response) {				
				var msg = "There was an error deleting the domain "+domainName+": \n"+errorMsg(response.data.error);
				AlertService.addAlert("error",msg);
				console.log(msg);				
				ProcessService.unregister();
			});					
		},

		/**
		* get the list of all domains		
		*
		* @method getDomainList		
		* @return {Array} Returns the domainList-member
		*/
		getDomainList: function() {
			return domainList;	
		},

		/**
		* get the list of all domains which are filtered	
		*
		* @method getDomainListFiltered		
		* @return {Array} Returns the domainListFiltered-member
		*/
		getDomainListFiltered: function() {
			return domainListFiltered;	
		},		

		/**
		* refreshes the internal member domainList and domainListFiltered 
		* with the data from the posty API
		*
		* @method refreshDomainList
		*/
		refreshDomainList: function() {
			refreshDomainList();
		}

	};
});

/**
* central account-model. Here you do all the CRUD-operations with the REST-API
*
* @class AccountService
*/
app.factory('AccountService', function(Restangular, DomainService, ProcessService, AlertService) {		
	var accountList = []; // list of all domains


	var refreshAccountList = function() {
			accountList = [];					
			ProcessService.register();
			Restangular.one('domains',DomainService.currentDomain()).all('users').getList().then(function(list) {										 	
			 	for (var i = 0; i < list.length; i++) {			 		
			 		accountList.push(list[i].virtual_user);				 				 		
			 	}					 													
				ProcessService.unregister();			
			});
	};	
   
	return {
		/**
		* creates an new account
		*
		* @method createAccount		
		* @param accountName {String} the name of the account
		* @param accountPassword {String} the password of the account
		*/		
		createAccount: function(accountName, accountPassword) {
			ProcessService.register();		
			var dao = Restangular.one('domains',DomainService.currentDomain()).all('users');
			var newData = {name: accountName, password: accountPassword}; 		
			dao.post(newData).then(function(response) {	
				var msg = "New account created: "+accountName;
				AlertService.addAlert("success",msg);
				console.log(msg);				
				refreshAccountList();	
				ProcessService.unregister();					
			}, function(response) {	
				var msg = "There was an error saving the account "+accountName+": \n"+errorMsg(response.data.error);
				AlertService.addAlert("error",msg);
				console.log(msg);						
				ProcessService.unregister();
			});				
		},

		/**
		* edit an existing account		
		*
		* @method editAccount		
		* @param accountNameOld {String} the old name of the account
		* @param accountNameNew {String} the new name of the account
		* @param accountPasswordNew {String} the new password of the account
		*/
		editAccount: function(accountNameOld, accountNameNew, accountPasswordNew) {		
			ProcessService.register();					
			var dao = Restangular.one('domains',DomainService.currentDomain()).one('users',accountNameOld);	
			dao.name = accountNameNew;
			if (accountPasswordNew != "")
				dao.password = accountPasswordNew;					
			dao.put().then(function(response) {							
				var msg = "Account "+accountNameNew+" updated!";
				AlertService.addAlert("success",msg);
				console.log(msg);	
				refreshAccountList();				
				ProcessService.unregister();
			}, function(response) {		
				var msg = "There was an error updating the account "+accountNameNew+": \n"+errorMsg(response.data.error);
				AlertService.addAlert("error",msg);
				console.log(msg);					
				ProcessService.unregister();
			});	
		},

		/**
		* remove an existing account by name
		*
		* @method removeAccount		
		* @param accountName {String} the name of the account
		*/
		removeAccount: function(accountName) {						
			ProcessService.register();			
			var dao = Restangular.one('domains',DomainService.currentDomain()).one('users',accountName);	
			dao.remove().then(function(response) {							
				var msg = "Account "+accountName+" deleted!";
				AlertService.addAlert("success",msg);
				console.log(msg);
				refreshAccountList();	
				ProcessService.unregister();			
			}, function(response) {				
				var msg = "There was an error deleting the account "+accountName+": \n"+errorMsg(response.data.error);
				AlertService.addAlert("error",msg);
				console.log(msg);				
				ProcessService.unregister();
			});	
		},

		/**
		* converts an email to an account-name
		*
		* @method eMailToAccountName		
		* @param eMail {String} the email
		*/
		eMailToAccountName: function(eMail) {
			return eMail.split("@")[0];
		},	

		/**
		* get the list of all accounts		
		*
		* @method getAccountList		
		* @return {Array} Returns the accountList-member
		*/
		getAccountList: function() {
			return accountList;	
		},

		/**
		* refreshes the internal member accountList with the data from the posty API
		*
		* @method refreshAccountList
		*/		
		refreshAccountList: function() {
			refreshAccountList();
		}
	};
});

/**
* central alias-model. Here you do all the CRUD-operations with the REST-API
*
* @class AliasService
*/
app.factory('AliasService', function(Restangular, DomainService, ProcessService, AlertService) {		
	var aliasList = [];	// list of all aliases
	
	var refreshAliasList = function() {
			aliasList = [];					
			ProcessService.register();
			Restangular.one('domains',DomainService.currentDomain()).all('aliases').getList().then(function(list) {										 	
			 	for (var i = 0; i < list.length; i++) {						 		
			 		aliasList.push(list[i].virtual_alias);				 				 		
			 	}					 													
				ProcessService.unregister();			
			});
	};	 
  
	return {
		/**
		* creates an new alias
		*
		* @method createAlias		
		* @param aliasSource {String} the source of the alias
		* @param aliasDestination {String} the destination of the alias
		*/			
		createAlias: function(aliasSource, aliasDestination) {
			ProcessService.register();		
			var dao = Restangular.one('domains',DomainService.currentDomain()).all('aliases');
			var newData = {source: aliasSource, destination: aliasDestination}; 					
			dao.post(newData).then(function(response) {	
				var msg = "New alias created: "+aliasSource;
				AlertService.addAlert("success",msg);
				console.log(msg);				
				refreshAliasList();	
				ProcessService.unregister();					
			}, function(response) {	
				var msg = "There was an error saving the alias "+aliasSource+": \n"+errorMsg(response.data.error);
				AlertService.addAlert("error",msg);
				console.log(msg);						
				ProcessService.unregister();
			});							
		},

		/**
		* edit an existing alias		
		*
		* @method editAlias		
		* @param aliasOldSource {String} the old source of the alias
		* @param aliasNewSource {String} the new source of the alias
		* @param aliasDestination {String} the new destination of the alias
		*/
		editAlias: function(aliasOldSource, aliasNewSource, aliasDestination) {	
			ProcessService.register();		
			var dao = Restangular.one('domains',DomainService.currentDomain()).one('aliases',aliasOldSource);	
			dao.source = aliasNewSource;
			if (aliasDestination != "")
				dao.destination = aliasDestination;					
			dao.put().then(function(response) {							
				var msg = "Alias "+aliasNewSource+" updated!";
				AlertService.addAlert("success",msg);
				console.log(msg);	
				refreshAliasList();				
				ProcessService.unregister();
			}, function(response) {		
				var msg = "There was an error updating the alias "+aliasNewSource+": \n"+errorMsg(response.data.error);
				AlertService.addAlert("error",msg);
				console.log(msg);					
				ProcessService.unregister();
			});	
		},

		/**
		* remove an existing alias by name
		*
		* @method removeAlias		
		* @param accountName {String} the name of the alias
		*/
		removeAlias: function(aliasSource) {						
			ProcessService.register();			
			var dao = Restangular.one('domains',DomainService.currentDomain()).one('aliases',aliasSource);	
			dao.remove().then(function(response) {							
				var msg = "Alias "+aliasSource+" deleted!";
				AlertService.addAlert("success",msg);
				console.log(msg);
				refreshAliasList();	
				ProcessService.unregister();			
			}, function(response) {				
				var msg = "There was an error deleting the alias "+aliasSource+": \n"+errorMsg(response.data.error);
				AlertService.addAlert("error",msg);
				console.log(msg);				
				ProcessService.unregister();
			});		
		},

		/**
		* get the list of all aliases		
		*
		* @method getAliasList		
		* @return {Array} Returns the aliasList-member
		*/
		getAliasList: function() {
			return aliasList;	
		},

		/**
		* refreshes the internal member aliasList with the data from the posty API
		*
		* @method refreshAliasList
		*/				
		refreshAliasList: function() {
			refreshAliasList();
		}

	};
});