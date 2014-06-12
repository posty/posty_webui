/*!
 * posty_webUI directives
 *
 * Copyright 2014 posty-soft.org
 * Licensed under the LGPL v3
 * https://www.gnu.org/licenses/lgpl.html
 *
 */
define(['angular', 'services', 'd3'], function(angular, services, d3) {
	'use strict';

  	/* Directives */

  	var app = angular.module('postySoft.directives', ['postySoft.services'])

	/**
	* directive which returns the app-version defined in the postySoft.services
	*
	* @directive appVersion
	*/
	app.directive('appVersion', ['version', function(version) {
			return function(scope, elm, attrs) {
				elm.text(version);
		};
	}]);

	/**
	* directive to validate passwords in the html-view
	*
	* @directive passwordValidator
	*/
	app.directive('passwordValidator', [function() {
	  return {
	    require: 'ngModel',
	    link: function(scope, elm, attr, ctrl) {
	      var pwdWidget = elm.inheritedData('$formController')[attr.passwordValidator];

	      ctrl.$parsers.push(function(value) {
	        if (value === pwdWidget.$viewValue) {
	          ctrl.$setValidity('MATCH', true);
	          return value;
	        }
	        ctrl.$setValidity('MATCH', false);
	      });

	      pwdWidget.$parsers.push(function(value) {
	        ctrl.$setValidity('MATCH', value === ctrl.$viewValue);
	        return value;
	      });
	    }
	  };
	}]);

	/**
	* directive to focus an element in the html-view
	*
	* @directive focus
	*/
	app.directive('focus', function () {
	  return function (scope, element, attrs) {
	    attrs.$observe('focus', function (newValue) {
	      newValue === 'true' && element[0].focus();
	    });
	  }
	});

	/**
	* directive to build a simple chart in the html-view
	*
	* @directive barsChart
	*/
	app.directive('barsChart', ['$parse', function ($parse) {
	  return {
	    restrict: 'E',
	    replace: true,
	    scope: {data: '=chartData'},
	    link: function (scope, element, attrs) {
	      var chart = d3.select(element[0]);
	      scope.$watchCollection('data', function(newValue, oldValue) {
	        chart.append("div").attr("class", "chart")
	        .selectAll('div')
	        .data(scope.data).enter().append("div")
	        .transition().ease("elastic")
	        .style("width", function(d) { 
	         var tmp = 10;
	         var val = d.percent + tmp; 
	         if(val >= 100) {
	            val = 98; 
	          }            
	         return val + "%";
	        })
	        .text(function(d) { 
	          return d.caption; 
	        });
	      });
	    } 
	  };      
	}]);

	/**
	* directive to open the datepicker
	*
	* @directive dateclick
	*/
	app.directive("dateclick", function(){
		return {						
			link: function($scope, element, attrs) {
				$scope.dateIsOpen = false;
				
				$scope.openCalendar = function(event){
					event.preventDefault();
					event.stopPropagation();										
					$scope.dateIsOpen = !$scope.dateIsOpen;
				};				
			}			
		}
	});	

	/**
	* directive to open a dropdown-menu without 
	* changing the route (href-directive)
	*
	* @directive dropdownclick
	*/
	app.directive("dropdownNoRouteChange", function(){
		return {						
			link: function($scope, element, attrs) {
				$scope.dropDownIsOpen = false;
				
				$scope.openDropDown = function(event){																			
					$scope.dropDownIsOpen = !$scope.dropDownIsOpen;
				};				
			}			
		}
	});	

});
