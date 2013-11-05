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

