'use strict';

var app = angular.module('postySoft.directives', []);

/**
* a simple directive to validate passwords in the html-view
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

app.directive('focus', function () {
  return function (scope, element, attrs) {
    attrs.$observe('focus', function (newValue) {
      newValue === 'true' && element[0].focus();
    });
  }
});


app.directive('bars', function ($parse) {
      return {
         restrict: 'E',
         replace: true,
         template: '<div id="chart"></div>',
         link: function (scope, element, attrs) {
           var data = attrs.data.split(','),
           chart = d3.select('#chart')
             .append("div").attr("class", "chart")
             .selectAll('div')
             .data(data).enter()
             .append("div")
             .transition().ease("elastic")
             .style("width", function(d) { 
               var val = d.split(':')[1];
               val = parseInt(val);
               var tmp = 5;
               val = val + tmp;
               
              if(val >= 100) {
                val = 98; 
              }
               console.log("VAL: "+val);           
                return val + "%"; })           
             .text(function(d) {               
               return d; 
             });
         } 
      };
   });