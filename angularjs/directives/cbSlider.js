/**
 * Cobalt Slider
 * - Generic Slider
 *
 * <element cb-slider="options" ng-model="collection"></element>
 *
 * options [Object]
 *   option name    : type     : default    : description
 *   =====================================================================================
 *   collectionName : String   : 'pages'    : Name of paged collection attached to scope
 *   perPage        : Number   : 1          : Number of article per page
 *   defaultPage    : Number   : 0          : Starting page/item (if it exceeds maximum page it defaults to last pge)
 *   autoPlay       : Boolean  : false      : Auto progress the slider
 *   initialDelay   : Number   : 7000       : Time in ms before auto play starts
 *   delay          : Number   : 5000       : Minimum time in ms between slides
 *   delayFlux      : Number   : 1000       : Maximum additional time in ms between slides
 *
 * collection [Array]
 *
 <example>
    <div ng-init='people = [{"name":"Arnold"},{"name":"Joshua"},{"name":"Cassiopeia"}]'
         cb-slider='{perPage: 2, collectionName: "groups"}' ng-model="people">
        <div ng-repeat="group in slider.groups">
            <span ng-repeat="person in group">{{ person.name }}</span>
        </div>
    </div>
 </example>
 */

angular.module('cbSlider', []).directive('cbSlider', function ($timeout) {
    'use strict';

    return {
        restrict: 'A',
        scope: true,
        require: 'ngModel',
        link: function (scope, element, attrs, ngModel) {
            var next,
                options,
                resetTimer,
                timer = null,
                slider,
                thePages;

            options = {
                'defaultPage'   : 0,
                'perPage'       : 1,
                'collectionName': 'pages',
                'autoPlay'      : false,
                'initialDelay'  : 7000,
                'delay'         : 5000,
                'delayFlux'     : 1000
            };

            angular.extend(options, scope.$eval(attrs.cbSlider));

            slider = scope.slider = {
                // slider.lastPage is recalculated once each time the model changes
                lastPage: null,
                left: null,
                currentPage: options.defaultPage,
                perPage: options.perPage,
                onPage: function (index) {
                    return index === slider.currentPage;
                },
                next: function () {
                    resetTimer();

                    if (slider.currentPage < slider.lastPage) {
                        slider.left = true;
                        slider.currentPage++;
                    }
                },
                prev: function () {
                    resetTimer();

                    if (slider.currentPage > 0) {
                        slider.left = false;
                        slider.currentPage--;
                    }
                },
                goto: function (index) {
                    resetTimer();

                    if (index >= 0 && index <= slider.lastPage) {
                        if (slider.currentPage < index) {
                            slider.left = true;
                        } else {
                            slider.left = false;
                        }
                        slider.currentPage = index;
                    }
                }
            };

            ngModel.$render = function () {
                var newValue = ngModel.$modelValue;
                if (!angular.isDefined(newValue)) {
                    slider[options.collectionName] = null;
                } else {
                    slider.lastPage = Math.ceil(newValue.length / options.perPage) - 1;

                    if (slider.currentPage > slider.lastPage) {
                        slider.currentPage = slider.lastPage;
                    }

                    // Split collection into pages, if necessary
                    if (options.perPage === 1) {
                        thePages = newValue;
                    } else {
                        thePages = [];
                        for (var i = 0, _length = newValue.length; i < _length; i += options.perPage) {
                            thePages.push(newValue.slice(i, i + options.perPage));
                        }
                    }

                    slider[options.collectionName] = thePages;
                }
            };

            next = function () {
                var nextId = (slider.currentPage + 1) % (slider.lastPage + 1);

                slider.left = true;
                slider.currentPage = nextId;
                timer = $timeout(next, options.delay + Math.random() * options.delayFlux);
            };

            resetTimer = (options.autoPlay) ? function () {
                if (timer !== null) {
                    $timeout.cancel(timer);
                    timer = $timeout(next, options.initialDelay);
                }
            } : angular.noop;

            if (options.autoPlay === true) {
                timer = $timeout(next, options.initialDelay);
            }
        }
    };
});
