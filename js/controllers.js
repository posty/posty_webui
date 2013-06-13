'use strict';

var app = angular.module('postySoft.controllers', []);

/**
* view-controller for the process-service
*
* @class ProcessCtrl
*/
function ProcessCtrl($scope, ProcessService) {
	$scope.ProcessService = ProcessService;	
}

/**
* view-controller for the alert-service
*
* @class AlertCtrl
*/
function AlertCtrl($scope, AlertService) {
	$scope.AlertService = AlertService;	
}

/**
* main-view-controller. first controller which will be instanced 
*
* @class MainCtrl
*/
function MainCtrl($rootScope, $scope, Page, DomainService) {

	/**
	* initialises the controller-data
	*
	* @method init	
	*/	
	$rootScope.init = function() {			
		DomainService.refreshDomainList();
		$scope = $rootScope;
		$scope.Page = Page;	
		$scope.DomainService = DomainService;	
	};		
}

/**
* view-controller for the dashboard
*
* @class DashboardCtrl
*/
function DashboardCtrl($scope, Page, DomainService) {
	Page.setTitle('Dashboard');
}

/**
* view-controller for the accounts
*
* @class AccountCtrl
*/
function AccountCtrl($scope, Page, DomainService, AccountService) {	

	/**
	* initialises the controller-data
	*
	* @method init	
	*/	
	$scope.init = function() {		
		Page.setTitle('Account');
		DomainService.setOnCurrentDomainChange(onCurrentDomainChange);
		onCurrentDomainChange();
		$scope.AccountService = AccountService;			
	};		

	/**
	* event which will be caused by switching the current domain
	*
	* @method onCurrentDomainChange	
	*/
	var onCurrentDomainChange = function() {
		$scope.selectDomainIsVisible = DomainService.allDomainsSelected();		
		if (!DomainService.allDomainsSelected())
			AccountService.refreshAccountList();
	}	
	
	/**
	* create an new account
	*
	* @method create	
	* @param account {Object} account-object
	*/	
	$scope.create = function(account) {	
		AccountService.createAccount(account.name, account.password);
		$scope.createIsVisible = false;	
	};

	/**
	* edit an existing account
	*
	* @method edit	
	* @param account {Object} account-object
	*/	
	$scope.edit = function(account) {	
		AccountService.editAccount(account.oldName, account.name, account.newPassword);		
		$scope.editIsVisible = false;	
	};	

	/**
	* remove an existing account
	*
	* @method remove	
	* @param account {Object} account-object
	*/	
	$scope.remove = function(account) {					
		var accountName = AccountService.eMailToAccountName(account.name);		
		AccountService.removeAccount(accountName);		
		$scope.removeIsVisible = false;			
	};		
	
	/**
	* initialises the create-view
	*
	* @method initCreate		
	*/		
	$scope.initCreate = function() {					
		if ($scope.createAccount != null) {			
			$scope.createAccount.name = "";
			$scope.createAccount.password = "";
			$scope.createAccount.confirmPassword = "";			
		}			
		$scope.createIsVisible = true;	
	};		

	/**
	* closes the create-view
	*
	* @method closeCreate		
	*/
	$scope.closeCreate = function() {					
		$scope.createIsVisible = false;	
	};		
	
	/**
	* initialises the edit-view
	*
	* @method initEdit
	* @param account {Object} account-object		
	*/		
	$scope.initEdit = function(account) {				
		$scope.editAccount = angular.copy(account);			
		$scope.editAccount.domain = DomainService.currentDomain();
		//$scope.editAccount.name = AccountService.eMailToAccountName(account.email);
		$scope.editAccount.oldName = $scope.editAccount.name;	
		$scope.editAccount.checkOldPassword = $scope.editAccount.password;
		$scope.editAccount.oldPassword = "";
		$scope.editAccount.newPassword = "";
		$scope.editAccount.confirmNewPassword = "";
		$scope.editIsVisible = true;
	};		
	
	/**
	* closes the edit-view
	*
	* @method closeEdit		
	*/	
	$scope.closeEdit = function() {					
		$scope.editIsVisible = false;	
	};		
	
	/**
	* initialises the remove-view
	*
	* @method initRemove	
	* @param account {Object} account-object	
	*/	
	$scope.initRemove = function(account) {					
		$scope.removeIsVisible = true;
		$scope.removeAccount = angular.copy(account);			
	};	

	/**
	* closes the remove-view
	*
	* @method closeRemove		
	*/		
	$scope.closeRemove = function () {    
		$scope.removeIsVisible = false;
	};	

	/**
	* sets the selected domain in the domain-service and closes the select-domain-view
	*
	* @method closeRemove
	* @param domain {Object} domain-object
	*/
	$scope.selectDomain_ = function(domain) {				
		DomainService.setCurrenDomain(domain.name);		
		$scope.selectDomainIsVisible = false;
	};	
}

/**
* view-controller for the aliases
*
* @class AliasCtrl
*/
function AliasCtrl($scope, Page, DomainService, AccountService, AliasService) {	

	/**
	* initialises the controller-data
	*
	* @method init	
	*/	
	$scope.init = function() {			
		Page.setTitle('Alias');	
		DomainService.setOnCurrentDomainChange(onCurrentDomainChange);
		onCurrentDomainChange();	
		$scope.AccountService = AccountService;	
		$scope.AliasService = AliasService;			
	};		

	/**
	* event which will be caused by switching the current domain
	*
	* @method onCurrentDomainChange	
	*/
	var onCurrentDomainChange = function() {
		$scope.selectDomainIsVisible = DomainService.allDomainsSelected();		
		if (!DomainService.allDomainsSelected()) {
			AccountService.refreshAccountList();		
			AliasService.refreshAliasList();		
		}	
	}	

	/**
	* create an new alias
	*
	* @method create	
	* @param alias {Object} alias-object
	*/	
	$scope.create = function(alias) {			
		var source = alias.source;			
		AliasService.createAlias(source, alias.destination);
		$scope.createIsVisible = false;	
	};
	
	/**
	* edit an existing alias
	*
	* @method edit	
	* @param alias {Object} alias-object
	*/		
	$scope.edit = function(alias) {	
		AliasService.editAlias(alias.oldSource, alias.source, alias.destination);		
		$scope.editIsVisible = false;	
	};	

	/**
	* remove an existing alias
	*
	* @method remove	
	* @param alias {Object} alias-object
	*/	
	$scope.remove = function(alias) {
		var source = AccountService.eMailToAccountName(alias.source);								
		AliasService.removeAlias(source);				
		$scope.removeIsVisible = false;			
	};		
	
	/**
	* initialises the create-view
	*
	* @method initCreate		
	*/		
	$scope.initCreate = function() {					
		if ($scope.createAlias != null) {
			$scope.createAlias.source = "";
			$scope.createAlias.destination = "";
		}			
		$scope.createIsVisible = true;	
	};		

	/**
	* closes the create-view
	*
	* @method closeCreate		
	*/
	$scope.closeCreate = function() {					
		$scope.createIsVisible = false;	
	};		
	
	/**
	* initialises the edit-view
	*
	* @method initEdit	
	* @param alias {Object} alias-object
	*/		
	$scope.initEdit = function(alias) {		
		$scope.editAlias = angular.copy(alias);			
		$scope.editAlias.domain = DomainService.currentDomain();
		//$scope.editAlias.source = AccountService.eMailToAccountName(alias.source);
		$scope.editAlias.oldSource = $scope.editAlias.source;				
		$scope.editIsVisible = true;
	};		
	
	/**
	* closes the edit-view
	*
	* @method closeEdit		
	*/	
	$scope.closeEdit = function() {					
		$scope.editIsVisible = false;	
	};		
	
	/**
	* initialises the remove-view
	* @param alias {Object} alias-object
	*
	* @method initRemove		
	*/	
	$scope.initRemove = function(alias) {					
		$scope.removeAlias = angular.copy(alias);		
		$scope.removeIsVisible = true;		
	};	
	
	/**
	* closes the remove-view
	*
	* @method closeRemove		
	*/	
	$scope.closeRemove = function () {    
		$scope.removeIsVisible = false;
	};	

	/**
	* sets the selected domain in the domain-service and closes the select-domain-view
	*
	* @method closeRemove
	* @param domain {Object} domain-object
	*/
	$scope.selectDomain_ = function(domain) {				
		DomainService.setCurrenDomain(domain.name);		
		$scope.selectDomainIsVisible = false;
	};			
}

function DomainCtrl($scope, Page, DomainService) {

	/**
	* initialises the controller-data
	*
	* @method init	
	*/	
	$scope.init = function() {		
		Page.setTitle('Domain');	
	};			
	
	/**
	* create a new domain
	*
	* @method create	
	* @param domain {Object} domain-object
	*/		
	$scope.create = function(domain) {	
		DomainService.createDomain(domain.name);
		$scope.createIsVisible = false;	
	};
	
	/**
	* edit an existing domain
	*
	* @method edit	
	* @param domain {Object} domain-object
	*/		
	$scope.edit = function(domain) {				
		DomainService.editDomain(domain.oldName, domain.name);
		$scope.editIsVisible = false;	
	};	

	/**
	* remove an existing domain
	*
	* @method remove	
	* @param domain {Object} domain-object
	*/	
	$scope.remove = function(domain) {	
		DomainService.removeDomain(domain.name);
		$scope.removeIsVisible = false;			
	};		

	/**
	* initialises the create-view
	*
	* @method initCreate		
	*/		
	$scope.initCreate = function() {		
		if ($scope.createDomain != null)
			$scope.createDomain.name = "";			
		$scope.createIsVisible = true;	
	};		

	/**
	* closes the create-view
	*
	* @method closeCreate		
	*/	
	$scope.closeCreate = function() {				
		$scope.createIsVisible = false;	
	};		
	
	/**
	* initialises the edit-view
	*
	* @method initEdit		
	* @param domain {Object} domain-object
	*/			
	$scope.initEdit = function(domain) {		
		$scope.editIsVisible = true;		
		$scope.editDomain = angular.copy(domain);		
		$scope.editDomain.oldName = domain.name;
	};		
	
	/**
	* closes the edit-view
	*
	* @method closeEdit		
	*/	
	$scope.closeEdit = function() {					
		$scope.editIsVisible = false;	
	};		
	
	/**
	* initialises the remove-view
	*
	* @method initRemove		
	* @param domain {Object} domain-object
	*/		
	$scope.initRemove = function(domain) {					
		$scope.removeIsVisible = true;
		$scope.removeDomain = angular.copy(domain);;			
	};	
	
	/**
	* closes the remove-view
	*
	* @method closeRemove		
	*/		
	$scope.closeRemove = function () {    
		$scope.removeIsVisible = false;
	};	
}