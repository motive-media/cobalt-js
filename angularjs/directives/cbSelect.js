/**
 * Cobalt Select
 * - Styleable select
 */

angular.module('cbSelect', []).directive('cbSelect', function (){
   'use strict';

    return {
        restrict: 'A',
        scope: {
            'options': '='
        },
        template: '<div class="cb-select">' +
            '<div class="cb-select-value" ng-click="toggle()"><span>{{ selectedItem.label || placeholder }}</span><i></i></div>' +
            '<div class="cb-select-options" ng-show="show">' +
            '<div class="cb-select-option" ng-repeat="option in options" ng-click="select(option)" ng-class="{active: option == selectedItem}">{{ option.label }}</div>' +
            '</div>' +
            '<select>' +
            '<option ng-repeat="o in options" value="{{ o.value }}" ng-selected="o.value == selectedItem.value">{{ o.label }}</option>' +
            '</select>' +
            '</div>',
        replace: true,
        require: '?ngModel',
        link: function (scope, element, attrs, ngModel) {
            scope.show = false;
            scope.placeholder = attrs.placeholder || 'Select a value';

            ngModel.$render = function () {
                scope.selectedItem = ngModel.$viewValue;
            };

            scope.select = function (item) {
                scope.selectedItem = item;
                scope.show = false;
                ngModel.$setViewValue(item);
                console.log(item, scope.selectedValue, ngModel.$viewValue);
            };

            scope.toggle = function () {
                scope.show = !scope.show;
            };
        }
    };
});