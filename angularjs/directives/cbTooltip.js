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
        compile: function (tElement, tAttrs) {
            return {
                post: function (scope, element, attrs) {
                    var options, tooltip, show, hide, setPosition, el, elArrow, tooltipElem, tooltipArrow;

                    options = {
                        tpl: '<div class="cb-tooltip" ng-style="style" ng-show="show">' +
                             '<header ng-if="title">{{title}}</header>' +
                             '<section>{{content}}</section>' +
                             '</div>',
                        tplArrow: '<div class="arrow" ng-style="arrowStyle"></div>',
                        position: 'top',
                        space: 8,
                        content: ':)'
                    };

                    // Add alias for scope
                    tooltip = scope;

                    angular.extend(options, scope.$eval(attrs.cbTooltip));
                    tooltip.position = options.position;
                    tooltip.space = options.space;
                    tooltip.tpl = options.tpl;
                    tooltip.show = false;
                    tooltip.tplArrow = options.tplArrow;

                    el = angular.element(tooltip.tpl);
                    elArrow = angular.element(tooltip.tplArrow);

                    tooltipElem = $compile(el)(scope);
                    tooltipArrow = $compile(elArrow)(scope);

                    element.addClass('cb-tooltip-active');

                    tooltipElem.append(tooltipArrow);
                    tooltipElem.addClass(tooltip.position);
                    angular.element(document.body).append(tooltipElem);


                    show = function () {
                        tooltip.$apply(function () {
                            tooltip.show = true;
                        });

                        setPosition();
                    };

                    hide = function () {
                        tooltip.$apply(function () {
                            tooltip.show = false;
                        });
                    };

                    setPosition = function () {
                        var os = element.offset(),
                            eWidth = element.outerWidth(true),
                            eHeight = element.outerHeight(true),
                            tWidth = tooltipElem.outerWidth(true),
                            tHeight = tooltipElem.outerHeight(true),
                            arrowWidth = tooltipArrow.outerWidth(true),
                            arrowHeight = tooltipArrow.outerHeight(true),
                            top = 0,
                            left = 0,
                            arrowStyle = {};

                        // set up css for individual positions
                        if ('top' === tooltip.position) {
                            top = os.top - tHeight - tooltip.space;
                            arrowStyle.left = (tWidth / 2) - (arrowWidth / 2);
                        } else if ('bottom' === tooltip.position) {
                            top = os.top + eHeight + tooltip.space;
                            arrowStyle.left = (tWidth / 2) - (arrowWidth / 2);
                        } else if ('left' === tooltip.position) {
                            left = os.left - tWidth - tooltip.space;
                            arrowStyle.top = (tHeight / 2) - (arrowHeight / 2);
                        } else if ('right' === tooltip.position) {
                            left = os.left + eWidth + tooltip.space;
                            arrowStyle.top = (tHeight / 2) - (arrowHeight / 2);
                        }

                        // set up left css for top and bottom position
                        if ('top' === tooltip.position || 'bottom' === tooltip.position) {
                            if (tWidth > eWidth) {
                                left = os.left - ((tWidth - eWidth) / 2);
                            } else {
                                left = os.left + ((eWidth - tWidth) / 2);
                            }
                        }

                        // set up top css for left and right  position
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
                                left: left
                            };

                            tooltip.arrowStyle = arrowStyle;
                        });
                    };

                    element.on('mouseenter', show);
                    element.on('mouseleave', hide);
                }
            };
        }
    };
});
