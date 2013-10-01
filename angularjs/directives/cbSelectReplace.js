/**
 * Cobalt Select
 * - Styleable select replacer
 *
 * Simple add cb-select-replace as a class or attribute to replace a select with an styleable select.
 *
 * This class or attribute must be added before angular initializes OR you must manually compile any selects added to
 * the DOM after initialization (see $compile service).
 */

angular.module('cbSelectReplace', []).directive('cbSelectReplace', function (){
    'use strict';

    return {
        restrict: 'CA',
        scope: true,
        require: '?ngModel',
        compile: function (tElement, tAttrs) {
            var template, options = [];

            template = '<div class="cb-select" tabindex="0">' +
                '<div class="cb-select-value" ng-click="select.open()" ng-class="{active: select.show}" title="{{ select.selectedItem.label }}"><span>{{ select.selectedItem.label }}</span><i></i></div>' +
                '<div class="cb-select-options" ng-show="select.show">' +
                '<div class="cb-select-option" ng-repeat="option in select.options" ng-click="select.selectOption(option)" ng-class="{active: option == select.selectedItem}">{{ option.label }}</div>' +
                '</div>' +
                '<select ng-hide="true">' +
                '<option ng-repeat="o in select.options" value="{{ o.value }}" ng-selected="o.value == select.selectedItem.value">{{ o.label }}</option>' +
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
                    var select, selectedIndex = 0;

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
                            select.selectedItem = ngModel.$viewValue;
                        };
                    }

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
                        scope.$apply(function () {
                            select.keypress(event);
                        });
                    });
                }
            };
        }
    };
});