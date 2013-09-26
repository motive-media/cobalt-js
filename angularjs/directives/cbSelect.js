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
        template: '<div class="cb-select" tabindex="-1">' +
            '<div class="cb-select-value" ng-click="toggle()" ng-class="{active: show}"><span>{{ selectedItem[labelKey] || placeholder }}</span><i></i></div>' +
            '<div class="cb-select-options" ng-show="show">' +
            '<div class="cb-select-option" ng-repeat="option in options" ng-click="select(option)" ng-class="{active: option == selectedItem}">{{ option[labelKey] }}</div>' +
            '</div>' +
            '<select>' +
            '<option ng-repeat="o in options" value="{{ o[valueKey] }}" ng-selected="o[valueKey] == selectedItem[valueKey]">{{ o[labelKey] }}</option>' +
            '</select>' +
            '</div>',
        replace: true,
        require: '?ngModel',
        link: function (scope, element, attrs, ngModel) {
            var options;

            options = {
                placeholder: 'Select a value',
                labelKey: 'label',
                valueKey: 'value'
            };

            angular.extend(options, scope.$eval(attrs.cbSelect));
            scope.valueKey = options.valueKey;
            scope.labelKey = options.labelKey;
            scope.placeholder = options.placeholder;

            scope.show = false;

            ngModel.$render = function () {
                scope.selectedItem = ngModel.$viewValue;
            };

            scope.select = function (item) {
                scope.selectedItem = item;
                scope.show = false;
                ngModel.$setViewValue(item);
            };

            scope.toggle = function () {
                scope.show = !scope.show;
            };

            element.on('focusout', function(){
                scope.$apply(function(){
                    scope.show = false;
                });
            });
        }
    };
});
