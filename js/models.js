'use strict';

var app = angular.module('postySoft.models', []);


/**
* filters the error-messages of the response and returns the concated messages
*
* @method  @return {String} Returns the error-message
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
* @class AccountService
*/
app.factory('DomainService', function(Restangular, ProcessService, AlertService) {		
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
				 		console.log(list[i]);
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
		createAccount: function(accountName, accountPassword, accountQuota) {
			ProcessService.register();		
			var dao = Restangular.one('domains',DomainService.currentDomain()).all('users');
			var newData = {name: accountName, password: accountPassword, quota: accountQuota}; 		
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
		editAccount: function(accountNameOld, accountNameNew, accountPasswordNew, accountQuotaNew) {		
			ProcessService.register();					
			var dao = Restangular.one('domains',DomainService.currentDomain()).one('users',accountNameOld);	
			dao.name = accountNameNew;
			dao.quota = accountQuotaNew;
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
* central DomainAlias-model. Here you do all the CRUD-operations with the REST-API
*
* @class DomainAliasService
*/
app.factory('DomainAliasService', function(Restangular, ProcessService, AlertService) {		
	var aliasList = [];	// list of all aliases	
	
	var refreshDomainAliasList = function(domainName) {
			aliasList = [];				
			Restangular.one('domains',domainName).all('aliases').getList().then(function(list) {										 	
			 	for (var i = 0; i < list.length; i++) {				 					 		
			 		aliasList.push(list[i].virtual_domain_alias);			 						 				 		
			 	}					 													
				ProcessService.unregister();			
			});			
	};	

	return {
		/**
		* creates an new DomainAlias
		*
		* @method createDomainAlias		
		* @param aliasSource {String} the source of the alias
		* @param aliasDestination {String} the destination of the alias
		*/			
		createDomainAlias: function(domainName, aliasName) {
			ProcessService.register();		
			var dao = Restangular.one('domains',domainName).all('aliases');
			var newData = {name: aliasName}; 					
			dao.post(newData).then(function(response) {	
				var msg = "New domain alias created: "+aliasName;
				AlertService.addAlert("success",msg);
				console.log(msg);				
				refreshDomainAliasList(domainName);	
				ProcessService.unregister();					
			}, function(response) {	
				var msg = "There was an error saving the domain alias "+aliasName+": \n"+errorMsg(response.data.error);
				AlertService.addAlert("error",msg); 	
				console.log(msg);						
				ProcessService.unregister();
			});							
		},


		/**
		* edit an existing alias		
		*
		* @method editDomainAlias		
		* @param domainName {String} the domain name
		* @param oldAliasName {String} the old alias name
		* @param newAliasName {String} the new alias name
		*/
		editDomainAlias: function(domainName, oldAliasName, newAliasName) {	
			ProcessService.register();		
			var dao = Restangular.one('domains',domainName).one('aliases',oldAliasName);	
			dao.name = newAliasName;				
			dao.put().then(function(response) {							
				var msg = "Domain alias "+newAliasName+" updated!";
				AlertService.addAlert("success",msg);
				console.log(msg);	
				refreshDomainAliasList(domainName);				
				ProcessService.unregister();
			}, function(response) {		
				var msg = "There was an error updating the domain alias "+newAliasName+": \n"+errorMsg(response.data.error);
				AlertService.addAlert("error",msg);
				console.log(msg);					
				ProcessService.unregister();
			});	
		},	

		/**
		* remove an existing alias by name
		*
		* @method removeDomainAlias		
		* @param domainName {String} the domain name
		* @param aliasName {String} the alias to remove
		*/
		removeDomainAlias: function(domainName, aliasName) {						
			ProcessService.register();			
			var dao = Restangular.one('domains',domainName).one('aliases', aliasName);
			dao.remove().then(function(response) {							
				var msg = "Domain alias "+aliasName+" deleted!";
				AlertService.addAlert("success",msg);
				console.log(msg);
				refreshDomainAliasList(domainName);	
				ProcessService.unregister();			
			}, function(response) {				
				var msg = "There was an error deleting the domain alias "+aliasName+": \n"+errorMsg(response.data.error);
				AlertService.addAlert("error",msg);
				console.log(msg);				
				ProcessService.unregister();
			});		
		},

		/**
		* get the list of all aliases		
		*
		* @method getDomainAliasList		
		* @return {Array} Returns the aliasList-member
		*/
		getDomainAliasList: function() {			
			return aliasList;	
		},

		/**
		* refreshes the internal member aliasList with the data from the posty API
		*
		* @method refreshDomainAliasList
		*/				
		refreshDomainAliasList: function(domainName) {			
			refreshDomainAliasList(domainName);
		}
	};

});


/**
* central AccountAlias-model. Here you do all the CRUD-operations with the REST-API
*
* @class AccountAliasService
*/
app.factory('AccountAliasService', function(Restangular, ProcessService, AlertService) {		
	var aliasList = [];	// list of all aliases	
	
	var refreshAccountAliasList = function(domainName, accountName) {
			aliasList = [];				
			Restangular.one('domains',domainName).one('users',accountName).all('aliases').getList().then(function(list) {										 	
			 	for (var i = 0; i < list.length; i++) {				 					 		
			 		aliasList.push(list[i].virtual_user_alias);			 						 				 		
			 	}					 													
				ProcessService.unregister();			
			});			
	};	

	return {
		/**
		* creates an new AccountAlias
		*
		* @method createAccountAlias		
		* @param aliasSource {String} the source of the alias
		* @param aliasDestination {String} the destination of the alias
		*/			
		createAccountAlias: function(domainName, accountName, aliasName) {
			ProcessService.register();		
			var dao = Restangular.one('domains',domainName).one('users',accountName).all('aliases');
			var newData = {name: aliasName}; 					
			dao.post(newData).then(function(response) {	
				var msg = "New account alias created: "+aliasName;
				AlertService.addAlert("success",msg);
				console.log(msg);				
				refreshAccountAliasList(domainName, accountName);	
				ProcessService.unregister();					
			}, function(response) {	
				var msg = "There was an error saving the account alias "+aliasName+": \n"+errorMsg(response.data.error);
				AlertService.addAlert("error",msg); 	
				console.log(msg);						
				ProcessService.unregister();
			});							
		},


		/**
		* edit an existing alias		
		*
		* @method editAccountAlias		
		* @param domainName {String} the domain name
		* @param oldAliasName {String} the old alias name
		* @param newAliasName {String} the new alias name
		*/
		editAccountAlias: function(domainName, accoutName, oldAliasName, newAliasName) {	
			ProcessService.register();		
			var dao = Restangular.one('domains',domainName).one('users',accountName).one('aliases',oldAliasName);	
			dao.name = newAliasName;				
			dao.put().then(function(response) {							
				var msg = "Account alias "+newAliasName+" updated!";
				AlertService.addAlert("success",msg);
				console.log(msg);	
				refreshAccountAliasList(domainName, accountName);				
				ProcessService.unregister();
			}, function(response) {		
				var msg = "There was an error updating the account alias "+newAliasName+": \n"+errorMsg(response.data.error);
				AlertService.addAlert("error",msg);
				console.log(msg);					
				ProcessService.unregister();
			});	
		},	

		/**
		* remove an existing alias by name
		*
		* @method removeAccountAlias		
		* @param domainName {String} the domain name
		* @param aliasName {String} the alias to remove
		*/
		removeAccountAlias: function(domainName, accountName, aliasName) {						
			ProcessService.register();			
			var dao = Restangular.one('domains',domainName).one('users',accountName).one('aliases', aliasName);
			dao.remove().then(function(response) {							
				var msg = "Account alias "+aliasName+" deleted!";
				AlertService.addAlert("success",msg);
				console.log(msg);
				refreshAccountAliasList(domainName, accountName);	
				ProcessService.unregister();			
			}, function(response) {				
				var msg = "There was an error deleting the account alias "+aliasName+": \n"+errorMsg(response.data.error);
				AlertService.addAlert("error",msg);
				console.log(msg);				
				ProcessService.unregister();
			});		
		},

		/**
		* get the list of all aliases		
		*
		* @method getAccountAliasList		
		* @return {Array} Returns the aliasList-member
		*/
		getAccountAliasList: function() {			
			return aliasList;	
		},

		/**
		* refreshes the internal member aliasList with the data from the posty API
		*
		* @method refreshDomainAliasList
		*/				
		refreshAccountAliasList: function(domainName, accountName) {			
			refreshAccountAliasList(domainName, accountName);
		}
	};
});

app.factory('SummaryService', function(Restangular, ProcessService, AlertService, $http) {

	var summaryList = [];

	var refreshSummaryList = function(onRefreshSuccess) {
	
		ProcessService.register();
		    $http({method: 'GET', url: serverUrl+"/"+"summary"}).
		    success(function(data, status, headers, config) {
		     	console.log(data);
		    	ProcessService.unregister();
		    }).
		    error(function(data, status, headers, config) {
		    	ProcessService.unregister();
    		});

	/*
		Restangular.all('summary').getList().then(function(list) {	

		 	
		 	for (var i = 0; i < list.length; i++) {		 		
		 		summaryList.push(list[i].route);			 						 				 		
		 		console.log(list[i]);
		 	}
		 	onRefreshSuccess();
			
			
			ProcessService.unregister();									

		});		
		
		Restangular.all('summary').getList().then(function(list) {							
		 	for (var i = 0; i < list.length; i++) {		 		
		 		summaryList.push(list[i].route);			 						 				 		
		 		console.log(list[i]);
		 	}
		 	onRefreshSuccess();
			ProcessService.unregister();									
		});
*/
	};		

	return {
		refreshSummaryList: function(onRefreshSuccess) {								
			refreshSummaryList(onRefreshSuccess);
		},

		getSummaryList: function() {
			return summaryList;	
		}
	};
});