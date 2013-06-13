'use strict';

var app = angular.module('postySoft.services', []);

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
* central process-service. stores a stack for each "thread" which is performed
*
* @class ProcessService
*/
app.factory('ProcessService', function(){  
	var DUMMY_PUSH_ELEMENT = true;
	var processStack = [];	
	
	return {
		/**
		* pushes the process-stack
		*
		* @method register
		*/			
		register: function() { 			
			processStack.push(DUMMY_PUSH_ELEMENT);						
		},

		/**
		* pops an element fromt the process-stack
		*
		* @method unregister
		*/			
		unregister: function() { 			
			processStack.pop(); 						
		},

		/**
		* refers if the stack is full or not
		*
		* @method isLoading
		* @return {Boolean} true if the stack is not empty
		*/			
		isLoading: function() {
			return (processStack.length > 0); 
		}		
	};
});

/**
* central alert-service. stores a list of alerts (type and message)
*
* @class AlertService
*/
app.factory('AlertService', function($timeout){  
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
});

