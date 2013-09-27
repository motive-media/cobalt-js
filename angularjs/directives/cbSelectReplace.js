/**
 * Cobalt Select
 * - Styleable select replacer
 *
 * Simple add cb-select-replace as a class or attribute to replace a select with an styleable select.
 *
 * This class or attribute must be added before angular initializes OR you must manually compile any selects added to
 * the DOM after initialization (see $compile service).
 */

angular.module('cbSelectReplace', []).directive('cbSelectReplace', function ($compile){
    'use strict';

    return {
        restrict: 'CA',
        scope: true,
        require: '?ngModel',
        compile: function (tElement, tAttrs) {
            var template, options = [];

            template = '<div class="cb-select" tabindex="-1">' +
                '<div class="cb-select-value" ng-click="toggle()" ng-class="{active: show}" title="selectedItem.label"><span>{{ selectedItem.label }}</span><i></i></div>' +
                '<div class="cb-select-options" ng-show="show">' +
                '<div class="cb-select-option" ng-repeat="option in options" ng-click="select(option)" ng-class="{active: option == selectedItem}">{{ option.label }}</div>' +
                '</div>' +
                '<select ng-hide="true">' +
                '<option ng-repeat="o in options" value="{{ o.value }}" ng-selected="o.value == selectedItem.value">{{ o.label }}</option>' +
                '</select>' +
                '</div>';

            angular.forEach(tElement.children(), function (opt) {
                opt = angular.element(opt);

                options.push({
                    label: opt.text(),
                    value: opt.val()
                });
            });

            // Replace select manually, after all options are processed
            tElement.replaceWith(angular.element(template));

            return {
                post: function (scope, element, attrs, ngModel) {
                    scope.show = false;

                    if (ngModel) {
                        ngModel.$render = function () {
                            scope.selectedItem = ngModel.$viewValue;
                        };
                    }

                    scope.options = options;
                    scope.selectedItem = options[0];

                    scope.select = function (item) {
                        scope.selectedItem = item;
                        scope.show = false;

                        if (ngModel) {
                            ngModel.$setViewValue(item);
                        }
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
        }
    };
});