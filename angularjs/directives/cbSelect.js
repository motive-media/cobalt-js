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
        template: '<div class="cb-select" tabindex="0">' +
            '<div class="cb-select-value" ng-click="select.open()" ng-class="{active: select.show}" title="{{ select.selectedItem[labelKey] }}"><span>{{ select.selectedItem[labelKey] || placeholder }}</span><i></i></div>' +
            '<div class="cb-select-options" ng-show="select.show">' +
            '<div class="cb-select-option" ng-repeat="option in select.options" ng-click="select.selectOption(option)" ng-class="{active: option == select.selectedItem}">{{ option[labelKey] }}</div>' +
            '</div>' +
            '<select ng-hide="true">' +
            '<option ng-repeat="o in select.options" value="{{ o[valueKey] }}" ng-selected="o[valueKey] == select.selectedItem[valueKey]">{{ o[labelKey] }}</option>' +
            '</select>' +
            '</div>',
        replace: true,
        require: '?ngModel',
        link: function (scope, element, attrs, ngModel) {
            var options, _options, select, selectedIndex = 0;

            _options = {
                placeholder: 'Select a value',
                labelKey: 'label',
                valueKey: 'value'
            };

            angular.extend(_options, scope.$eval(attrs.cbSelect));
            scope.valueKey = _options.valueKey;
            scope.labelKey = _options.labelKey;
            scope.placeholder = _options.placeholder;

            scope.show = false;

            options = scope.options;
            select = scope.select = {
                show: false,
                focused: false,
                options: options,
                selectedItem: options[0],
                selectOption: function (option) {
                    selectedIndex = options.indexOf(option);

                    select.selectedItem = option;
                    select.close();

                    if (ngModel) {
                        ngModel.$setViewValue(option);
                    }
                },
                toggle: function () {
                    select.show = !select.show;
                },
                open: function () {
                    select.show = true;
                },
                close: function () {
                    select.show = false;
                },
                scrollIntoView: function () {
                    var optionsElem, optionElem;

                    optionsElem = element.find('.cb-select-options');
                    optionElem = element.find('.cb-select-option').eq(selectedIndex);

                    if (optionElem.position().top + optionElem.outerHeight() > optionsElem.height()) {
                        optionsElem.scrollTop(optionsElem.scrollTop() + optionElem.outerHeight() + optionElem.position().top - optionsElem.height());
                    } else if (optionElem.position().top < 0) {
                        optionsElem.scrollTop(optionsElem.scrollTop() + optionElem.position().top);
                    }
                },
                nextOption: function () {
                    if (selectedIndex < options.length - 1) {
                        select.selectedItem = options[++selectedIndex];
                        select.scrollIntoView();
                    }
                },
                prevOption: function () {
                    if (selectedIndex > 0) {
                        select.selectedItem = options[--selectedIndex];
                        select.scrollIntoView();
                    }
                },
                keypress: function (event) {
                    if (event.keyCode === 40) {
                        select.nextOption();
                    } else if (event.keyCode === 38) {
                        select.prevOption();
                    } else if (event.keyCode === 13) {
                        select.toggle();
                    }
                }
            };

            if (ngModel) {
                ngModel.$render = function () {
                    scope.selectedItem = ngModel.$viewValue;
                };
            }

            element.on('keydown', function (event) {
                scope.$apply(function () {
                    select.keypress(event);
                });
            });

            element.on('focus', function () {
                scope.$apply(function () {
                    select.open();
                });
            });

            element.on('focusout', function () {
                scope.$apply(function () {
                    select.close();
                });
            });
        }
    };
});