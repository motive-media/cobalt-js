/**
 * Cobalt Tooltip
 * - Generic Tooltip
 *
 * <element cb-tooltip="options" data-title="title" data-content="content"></element>
 *
 * options [Object]
 *   option name    : type     : default    : description
 *   =====================================================================================
 *   tpl           : String   : 'html...'       : html template for tooltip
 *   title         : String   : 'text...'       : title
 *   content       : String   : 'text/html'     : content
 *   space         : Number   : 8               : space between tooltip and element in pixels
 *   position      : String   : 'top'           : position of tooltip
 *
 * title [String]
 *
 * content [String]
 *
 <example>
    <article>
        <h2>Top</h2>
        <p><span href="#" cb-tooltip="{'position': 'top'}" title="Hello world" content="Lorem ipsum, son">Tooltip Demo</span></p>
    </article>
 </example>
 */
angular.module('cbTooltip', []).directive('cbTooltip', function ($compile) {
    'use strict';

    return {
        restrict: 'A',
        scope: {
            'title': '@title',
            'content': '@content'
        },
        compile: function (scope, element, attrs) {
            return {
                post: function (scope, element, attrs) {
                    var options, tooltip, show, hide, setPosition, el, tooltipElem;

                    options = {
                        tpl: '<div class="cb-tooltip" ng-style="style" ng-show="show">' +
                             '<div class="arrow"></div>' +
                             '<header ng-if="title">{{title}}</header>' +
                             '<section>{{content}}</section>' +
                             '</div>',
                        position: 'top',
                        space: 8
                    };

                    // Add alias for scope
                    tooltip = scope;

                    angular.extend(options, scope.$eval(attrs.cbTooltip));
                    tooltip.position = options.position;
                    tooltip.space = options.space;
                    tooltip.tpl = options.tpl;
                    tooltip.show = false;

                    el = angular.element(tooltip.tpl);
                    tooltipElem = $compile( el )( scope );

                    element.addClass('cb-tooltip-active');

                    show = function () {
                        angular.element(document.body).append(tooltipElem);
                        tooltipElem.addClass(tooltip.position);

                        tooltip.$apply(function () {
                            tooltip.show = true;
                        });

                        setPosition(); setPosition();
                    };

                    hide = function () {
                        tooltip.$apply(function () {
                            tooltip.show = false;
                            tooltipElem.remove();
                        });
                    };

                    setPosition = function () {
                        var os = element.offset(),
                            eWidth = element.outerWidth(true) || element.width(),
                            eHeight = element.outerHeight(true) || element.height(),
                            tWidth = tooltipElem.outerWidth(true) || tooltipElem.width(),
                            tHeight = tooltipElem.outerHeight(true) || tooltipElem.height(),
                            top = 0,
                            left = 0;

                        console.log({
                            os: os,
                            eWidth: eWidth,
                            eHeight: eHeight,
                            tWidth: tWidth,
                            tHeight: tHeight
                        });

                        if ('top' === tooltip.position) {
                            top = os.top - tHeight - tooltip.space;
                        } else if ('bottom' === tooltip.position) {
                            top = os.top + eHeight + tooltip.space;
                        } else if ('left' === tooltip.position) {
                            left = os.left - tWidth - tooltip.space;
                        } else if ('right' === tooltip.position) {
                            left = os.left + eWidth + tooltip.space;
                        }

                        if ('top' === tooltip.position || 'bottom' === tooltip.position) {
                            if (tWidth > eWidth) {
                                left = os.left - ((tWidth - eWidth) / 2);
                            } else {
                                left = os.left + ((eWidth - tWidth) / 2);
                            }
                        }

                        if ('left' === tooltip.position || 'right' === tooltip.position) {
                            if (tHeight > eHeight) {
                                top = os.top - (tHeight - eHeight) / 2;
                            } else {
                                top = os.top + (eHeight - tHeight) / 2;
                            }
                        }

                        tooltip.$apply(function () {
                            tooltip.style = {
                                top: top,
                                left: left,
                                position: 'absolute'
                            };
                        });
                    };

                    element.on('mouseenter', show);
                    element.on('mouseleave', hide);
                }
            };
        }
    };
});
