/**
 * Cobalt Select
 * - Styleable select
 */

angular.module('cbSelect', []).directive('cbSelect', function ($compile, $filter, $timeout){
    'use strict';

    return {
        restrict: 'A',
        scope: {
            'ngModel': '=',
            'options': '='
        },
        template: '<div class="cb-select" tabindex="0">' +
            '<div class="cb-select-value" ng-click="select.toggle()" ng-class="{active: select.show}" title="{{ select.selectedItem[labelKey] }}"><span>{{ select.selectedItem[labelKey] || placeholder }}</span><i></i></div>' +
            '<div class="cb-select-dropdown" ng-show="select.show">' +
            '<div class="cb-select-options">' +
            '<div class="cb-select-option" ng-repeat="option in select.options" ng-click="select.selectOption(option)" ng-class="{active: option == select.selectedItem}">{{ option[labelKey] }}</div>' +
            '</div>' +
            '<select ng-hide="true">' +
            '<option ng-repeat="o in select.options" value="{{ o[valueKey] }}" ng-selected="o[valueKey] == select.selectedItem[valueKey]">{{ o[labelKey] }}</option>' +
            '</select>' +
            '</div></div>',
        replace: true,
        link: function (scope, element, attrs) {
            var options, _options, select, selectedIndex = -1, $search, $options;

            _options = {
                placeholder: 'Select a value',
                labelKey: 'label',
                valueKey: 'value',
                search: false
            };

            angular.extend(_options, scope.$eval(attrs.cbSelect));
            scope.valueKey = _options.valueKey;
            scope.labelKey = _options.labelKey;
            scope.placeholder = _options.placeholder;

            if (_options.search) {
                element.find('.cb-select-dropdown').prepend(
                    $compile('<div class="cb-select-search"><input type="text" ng-model="select.search"/></div>')(scope)
                );
            }

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
                        select.nextOption();
                    } else if (event.keyCode === 38) {
                        select.prevOption();
                    } else if (event.keyCode === 13) {
                        select.toggle();
                    } else if (_options.search && /^[a-z0-9]+$/i.test(String.fromCharCode(event.keyCode)) && event.target !== $search.get(0)) {
                        select.open();
                        $timeout(function(){
                            $search.focus();
                            select.search = String.fromCharCode(event.keyCode).toLowerCase();
                        }, 15);
                    }
                }
            };

            scope.$watch('select.search', function (val) {
                // Use placeholder on compile
                if (!val) {
                    select.selectedItem = null;
                    return;
                }

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

            scope.$watch('select.selectedItem', function(newValue) {
                if (newValue) {
                    scope.ngModel = newValue;
                }
            });

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
});