;(function (factory) {
    'use strict';

    if (typeof define === 'function' && define.amd) {
        define(['angular'], factory);
    } else {
        factory(angular);
    }
}(function (angular) {
    'use strict';

    /**
     * Cobalt Slider
     * - Generic Slider
     *
     * <element cb-slider="options" cb-slider-data="collection"></element>
     *
     * options [Object]
     *   option name    : type     : default    : description
     *   =====================================================================================
     *   collectionName : String   : 'pages'    : Name of paged collection attached to scope
     *   perPage        : Number   : 1          : Number of article per page
     *   autoPlay       : Boolean  : false      : Auto progress the slider
     *   initialDelay   : Number   : 7000       : Time in ms before auto play starts
     *   delay          : Number   : 5000       : Minimum time in ms between slides
     *   delayFlux      : Number   : 1000       : Maximum additional time in ms between slides
     *
     * collection [Array]
     *
     <example>
        <div ng-init='people = [{"name":"Arnold"},{"name":"Joshua"},{"name":"Cassiopeia"}]'
             cb-slider='{perPage: 2, collectionName: 'groups'}' cb-slider-data="people">
            <div ng-repeat="group in slider.groups">
                <span ng-repeat="person in group">{{ person.name }}</span>
            </div>
        </div>
     </example>
     */

    angular.module('cbSlider', []).directive('cbSlider', function($timeout) {
        return {
            restrict: 'A',
            scope: {collection: '=cbSliderData'},
            link: function(scope, element, attrs) {
                var lastPage, next, options, resetTimer, timer = null, slider, thePages;

                options = {
                    'currentPage'   : 0,
                    'perPage'       : 1,
                    'collectionName': 'pages',
                    'autoPlay'      : false,
                    'initialDelay'  : 7000,
                    'delay'         : 5000,
                    'delayFlux'     : 1000
                };

                angular.extend(options, scope.$eval(attrs['cbSlider']));

                slider = scope.slider = {
                    currentPage: options.currentPage
                };

                scope.$watch('collection', function (newValue){

                    lastPage = Math.ceil(newValue.length / options.perPage) - 1;

                    // Split collection into pages, if necessary
                    if (options.perPage === 1) {
                        thePages = newValue
                    } else {
                        thePages = [];
                        for (var i = 0, _length = newValue.length; i < _length; i += options.perPage) {
                            thePages.push(newValue.slice(i, i + options.perPage));
                        }
                    }

                    slider[options.collectionName] = thePages;
                });

                next = function () {
                    var nextId = (slider.currentPage + 1) % (lastPage + 1);
                    slider.left = true;
                    slider.currentPage = nextId;
                    timer = $timeout(next, options.delay + Math.random() * options.delayFlux);
                };

                resetTimer = function () {
                    if (options.autoPlay && (timer != null)) {
                        $timeout.cancel(timer);
                        timer = $timeout(next, options.initialDelay);
                    }
                };

                slider.next = function () {
                    resetTimer();
                    if (slider.currentPage < lastPage) {
                        slider.left = true;
                        slider.currentPage++;
                    }
                };

                slider.prev = function() {
                    resetTimer();
                    if (slider.currentPage > 0) {
                        slider.left = false;
                        slider.currentPage--;
                    }
                };

                slider.goto = function(index) {
                    resetTimer();
                    if (index >= 0 && index <= lastPage) {
                        if (slider.currentPage < index) {
                            slider.left = true;
                        } else {
                            slider.left = false;
                        }
                        slider.currentPage = index;
                    }
                };

                if (options.autorotate === true) {
                    timer = $timeout(next, options.initialDelay);
                }
            }
        };
    });
}));
