'use strict';

var app = angular.module('postySoft.controllers', []);

/**
* view-controller for the process-service
*
* @class ProcessCtrl
*/
function ProcessCtrl($scope, ProcessService) {		
}

/**
* view-controller for the alert-service
*
* @class AlertCtrl
*/
function AlertCtrl($scope, AlertService) {	
}

/**
* main-view-controller. first controller which will be instanced 
*
* @class MainCtrl
*/
function MainCtrl($rootScope, $scope, Page, DomainService, ProcessService, AlertService) {

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
		$scope.ProcessService = ProcessService;
		$scope.AlertService = AlertService;	
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
function AccountCtrl($scope, Page, DomainService, AccountService, AccountAliasService) {	

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
		$scope.AccountAliasService = AccountAliasService;	
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
		// The API expects only Byte for the quota
		account.quota = account.quota * 1024 * 1024;
		AccountService.createAccount(account.name, account.password, account.quota);
		$scope.createIsVisible = false;	
	};

	/**
	* edit an existing account
	*
	* @method edit	
	* @param account {Object} account-object
	*/	
	$scope.edit = function(account) {	
		console.log("edit "+$scope.editAccount.quota);
		// The API expects only Byte for the quota
		account.quota = account.quota * 1024 * 1024;
		AccountService.editAccount(account.oldName, account.name, account.newPassword, account.quota);		
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
			$scope.createAccount.quota = "";			
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
		$scope.editAccount.oldName = $scope.editAccount.name;	
		$scope.editAccount.checkOldPassword = $scope.editAccount.password;
		$scope.editAccount.oldPassword = "";
		$scope.editAccount.newPassword = "";
		$scope.editAccount.confirmNewPassword = "";
		$scope.editAccount.quota = $scope.editAccount.quota / 1024 / 1024;	
		$scope.editAccount.newAlias = "";
		$scope.editAccount.tabIsVisible = new Array();
		$scope.editAccount.tabIsVisible[0] = true;
		$scope.editAccount.tabIsVisible[1] = false;	
		$scope.editIsVisible = true;
		AccountAliasService.refreshAccountAliasList($scope.editAccount.domain, $scope.editAccount.name);
	};			

	$scope.newPasswordKeyPress = function() {	
		console.log("pressed");			
		$scope.editAccount.passwordChanged = ($scope.editAccount.newPassword != '');
	};	

	$scope.editTabClick = function(index) {		
		$scope.editAccount.tabIsVisible[index] = true;
		for (var i = 0; i < $scope.editAccount.tabIsVisible.length; i++) {
			if (i != index)
				$scope.editAccount.tabIsVisible[i] = false;
		};	
	};		

	$scope.editCreateAlias = function(account) {	
		AccountAliasService.createAccountAlias(account.domain, account.name, account.newAlias);
		account.newAlias = "";
	};	
	
	$scope.editRemoveAlias = function(account, aliasName) {						
		AccountAliasService.removeAccountAlias(account.domain, account.name, aliasName);		
	};	

	$scope.tabClass = function(tab) {
		if (tab) {
		  return "active";
		} else {
		  return "";
		}
	}	
	
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

function DomainCtrl($scope, Page, DomainService, DomainAliasService) {

	/**
	* initialises the controller-data
	*
	* @method init	
	*/	
	$scope.init = function() {		
		Page.setTitle('Domain');	
		$scope.DomainAliasService = DomainAliasService;
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
		$scope.editDomain.newAlias = "";
		$scope.tabIsVisible = new Array();
		$scope.tabIsVisible[0] = true;
		$scope.tabIsVisible[1] = false;		
		DomainAliasService.refreshDomainAliasList(domain.name);		
	};		


	$scope.editTabClick = function(index) {		
		$scope.tabIsVisible[index] = true;
		for (var i = 0; i < $scope.tabIsVisible.length; i++) {
				if (i != index)
					$scope.tabIsVisible[i] = false;
			};	
	};		

	$scope.editCreateAlias = function(domain) {						
		DomainAliasService.createDomainAlias(domain.name, domain.newAlias);
		domain.newAlias = "";
	};	
	
	$scope.editRemoveAlias = function(domain, aliasName) {						
		DomainAliasService.removeDomainAlias(domain.name, aliasName);		
	};	

	$scope.tabClass = function(tab) {
		if (tab) {
		  return "active";
		} else {
		  return "";
		}
	}
	
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

function SummaryCtrl($scope, Page, SummaryService) {	

	$scope.onRefreshSuccess = function() {	
		var list = SummaryService.getSummaryList();			
		$scope.summmaryList = "";
		for (var i = 0; i < list.length; i++) {
			$scope.summmaryList = $scope.summmaryList.concat(list[i]).concat(", ");
		}		
		console.log("summary: "+$scope.summmaryList);		
	};		

	/**
	* initialises the controller-data
	*
	* @method init	
	*/	
	$scope.init = function() {		
		Page.setTitle('Summary');
		SummaryService.refreshSummaryList($scope.onRefreshSuccess);
	};		

}