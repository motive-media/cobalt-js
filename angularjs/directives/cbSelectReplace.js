/**
 * Cobalt Select
 * - Styleable select replacer
 *
 * Simple add cb-select-replace as a class or attribute to replace a select with an styleable select.
 *
 * This class or attribute must be added before angular initializes OR you must manually compile any selects added to
 * the DOM after initialization (see $compile service).
 */

angular.module('cbSelectReplace', []).directive('cbSelectReplace', function ($compile, $rootScope, $filter, $timeout){
    'use strict';

    return {
        restrict: 'CA',
        scope: true,
        require: '?ngModel',
        compile: function (tElement, tAttrs) {
            var template, options = [], startingIndex = 0, theSelect, selectName, tabindex, dirOptions;


            dirOptions = $rootScope.$eval(tAttrs.cbSelectReplace) || {};
            theSelect = (tElement.get(0).nodeName.toLowerCase() === 'select') ? tElement : tElement.find('select');
            selectName = theSelect.attr('name') || '';
            tabindex = theSelect.attr('tabindex') || 0;

            template = '<div class="cb-select" tabindex="'+tabindex+'">' +
                '<div class="cb-select-value" ng-click="select.toggle()" ng-class="{active: select.show}" title="{{ select.selectedItem.label }}"><span>{{ select.selectedItem.label }}</span><i></i></div>' +
                '<div class="cb-select-dropdown" ng-show="select.show">' +
                ((dirOptions.search) ? '<div class="cb-select-search"><input type="text" ng-model="select.search"/></div>' : '') +
                '<div class="cb-select-options">' +
                '<div class="cb-select-option" ng-repeat="option in select.options" ng-mousedown="select.selectOption(option)" ng-class="{active: option == select.selectedItem}">{{ option.label }}</div>' +
                '</div>' +
                '<select ng-hide="true" name="'+selectName+'">' +
                '<option ng-repeat="o in select.options" value="{{ o.value }}" ng-selected="o.value == select.selectedItem.value">{{ o.label }}</option>' +
                '</select>' +
                '</div></div>';

            angular.forEach(theSelect.find('option'), function (opt, index) {
                opt = angular.element(opt);

                options.push({
                    label: opt.text(),
                    value: opt.val()
                });

                if (opt.attr('selected') === 'selected') {
                    startingIndex = index;
                }
            });

            theSelect.replaceWith(angular.element(template));

            return {
                pre: function (scope, element, attrs, ngModel) {
                    var select, selectedIndex = startingIndex, $search, $options;

                    select = scope.select = {
                        show: false,
                        focused: false,
                        options: options,
                        selectedItem: options[startingIndex],
                        selectOption: function (option) {
                            selectedIndex = jQuery.inArray(option, options);

                            select.selectedItem = option;
                            select.close();
                        },
                        toggle: function () {
                            if (select.show) {
                                select.close();
                            } else {
                                select.open();
                            }
                        },
                        open: function () {
                            select.show = true;

                            $timeout(function () {
                                select.scrollIntoView();
                            }, 15);
                        },
                        close: function () {
                            select.show = false;
                            select.search = '';
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
                            if (selectedIndex < select.options.length - 1) {
                                select.selectedItem = select.options[++selectedIndex];
                                select.scrollIntoView();
                            }
                        },
                        prevOption: function () {
                            if (selectedIndex > 0) {
                                select.selectedItem = select.options[--selectedIndex];
                                select.scrollIntoView();
                            }
                        },
                        keypress: function (event) {
                            if (event.keyCode === 40) {
                                select.open();
                                select.nextOption();
                            } else if (event.keyCode === 38) {
                                select.open();
                                select.prevOption();
                            } else if (event.keyCode === 13) {
                                select.toggle();
                            } else if (dirOptions.search && /^[a-z0-9]+$/i.test(String.fromCharCode(event.keyCode)) && event.target !== $search.get(0)) {
                                select.open();
                                $timeout(function(){
                                    $search.focus();
                                    select.search = String.fromCharCode(event.keyCode).toLowerCase();
                                }, 15);
                            }
                        }
                    };

                    scope.$watch('select.search', function (val) {
                        select.options = $filter('filter')(options, val);

                        var index = select.options.indexOf(select.selectedItem);

                        if (index > -1) {
                            select.selectedItem = select.options[selectedIndex = index];

                            if (select.show) {
                                $timeout(function () {
                                    select.scrollIntoView();
                                }, 10);
                            }
                        } else {
                            select.selectedItem = select.options[selectedIndex = 0];
                        }
                    });

                    if (ngModel) {
                        ngModel.$render = function () {
                            select.selectedItem = ngModel.$viewValue;
                        };

                        scope.$watch('select.selectedItem', function (val) {
                            ngModel.$setViewValue(val);
                        });
                    }

                    $search = element.find('.cb-select-search>input');
                    $options = element.find('.cb-select-option');

                    // Force focus for IE
                    element.on('click', '.cb-select-value', function (e) {
                        element.trigger('focus');
                    });

                    element.on('focusout', function (e) {
                        if ((($search.length > 0) ? e.relatedTarget !== $search.get(0) : true)) {
                            scope.$apply(function () {
                                select.focused = false;
                                select.close();
                            });
                        }
                    });

                    $search.on('focusout', function (e) {
                        scope.$apply(function () {
                            select.focused = false;
                            select.close();
                        });
                    });

                    element.on('keydown', function (event) {
                        if([38, 40].indexOf(event.keyCode) > 0) {
                            event.preventDefault();
                        }

                        scope.$apply(function () {
                            select.keypress(event);
                        });
                    });
                }
            };
        }
    };
});