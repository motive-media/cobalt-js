/**
 * Cobalt Select
 * - Styleable select
 */

angular.module('cbSelect', []).directive('cbSelect', function (){
    'use strict';

    return {
        restrict: 'A',
        scope: {
            'ngModel': '=',
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
        link: function (scope, element, attrs) {
            var options, _options, select, selectedIndex = -1;

            _options = {
                placeholder: 'Select a value',
                labelKey: 'label',
                valueKey: 'value'
            };

            angular.extend(_options, scope.$eval(attrs.cbSelect));
            scope.valueKey = _options.valueKey;
            scope.labelKey = _options.labelKey;
            scope.placeholder = _options.placeholder;

            options = scope.options;
            select = scope.select = {
                show: false,
                focused: false,
                options: options,
                selectedItem: null,
                selectOption: function (option) {
                    selectedIndex = jQuery.inArray(option, options);

                    select.selectedItem = option;
                    select.close();
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

            scope.$watch('select.selectedItem', function(newValue) {
                if (newValue) {
                    scope.ngModel = newValue;
                }
            });

            // Force focus for IE
            element.on('click', function (e) {
                if (!angular.element(e.target).hasClass('cb-select-option')) {
                    element.trigger('focus');
                }
            });

            element.on('focus', function () {
                scope.$apply(function () {
                    select.focused = true;
                    select.open();
                });
            });

            element.on('focusout', function () {
                scope.$apply(function () {
                    select.focused = false;
                    select.close();
                });
            });

            element.on('keydown', function (event) {
                if (event.keyCode !== 9) {
                    event.preventDefault();
                }

                scope.$apply(function () {
                    select.keypress(event);
                });
            });
        }
    };
});