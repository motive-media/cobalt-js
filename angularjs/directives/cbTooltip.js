/**
 * Cobalt Tooltip
 * - Generic Tooltip
 *
 * <element cb-tooltip="options"></element>
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
 *
 <example>
    <article>
        <h2>Top</h2>
        <p><span href="#" cb-tooltip="{'position': 'top', 'content': 'Hello World'}" >Tooltip Demo</span></p>
    </article>
 </example>
 */
angular.module('cbTooltip', []).directive('cbTooltip', function ($compile) {
    'use strict';

    return {
        restrict: 'A',
        scope: {
            'tpl': '@tpl',
            'position': '@position',
            'title': '@title',
            'content': '@content',
            'space': '@space'
        },
        compile: function (scope, element, attrs) {
            return {
                post: function (scope, element, attrs) {
                    var defaults, tooltip, show, hide, setPosition, el, tooltipElem;

                    defaults = {
                        tpl: '<div class="cb-tooltip" ng-style="style">' +
                             '<div class="arrow"></div>' +
                             '<header ng-if="title">{{title}}</header>' +
                             '<section>{{content}}</section>' +
                             '</div>',
                        position: 'top',
                        space: 8
                    };

                    // Add alias for scope
                    tooltip = scope;

                    // Revert to defaults when value is not defined
                    scope.$watch('position', function (newValue) {
                        if(!angular.isDefined(newValue)) {
                            tooltip.position = defaults.position;
                        }
                    });

                    scope.$watch('space', function (newValue) {
                        if(!angular.isDefined(newValue)) {
                            tooltip.space = defaults.space;
                        }
                    });

                    scope.$watch('tpl', function (newValue) {
                        if (!angular.isDefined(newValue)) {
                            newValue = defaults.tpl;
                        }

                        el = angular.element(newValue);

                        tooltipElem = $compile( el )( scope );
                    });

                    element.addClass('cb-tooltip-active');

                    show = function () {
                        angular.element('body').append(tooltipElem);

                        tooltipElem.addClass(tooltip.position);

                        setPosition();
                    };

                    hide = function () {
                        tooltipElem.remove();
                    };

                    setPosition = function () {
                        var box = tooltipElem,
                            os = element.offset(),
                            eWidth = element.width(),
                            eHeight = element.height(),
                            tWidth = box.width(),
                            tHeight = box.height(),
                            top = 0,
                            left = 0,
                            ePadding = {
                                top: element.css('padding-top'),
                                right: element.css('padding-right'),
                                bottom: element.css('padding-bottom'),
                                left: element.css('padding-left')
                            },
                            eMargin = {
                                top: element.css('margin-top'),
                                right: element.css('margin-right'),
                                bottom: element.css('margin-bottom'),
                                left: element.css('margin-left')
                            };

                        eWidth += parseInt(ePadding.left.replace('px', ''), 10) + parseInt(ePadding.right.replace('px', ''), 10);
                        eHeight += parseInt(ePadding.top.replace('px', ''), 10) + parseInt(ePadding.bottom.replace('px', ''), 10);

                        eWidth += parseInt(eMargin.left.replace('px', ''), 10) + parseInt(eMargin.right.replace('px', ''), 10);
                        eHeight += parseInt(eMargin.top.replace('px', ''), 10) + parseInt(eMargin.bottom.replace('px', ''), 10);

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
                                left = os.left - ((tWidth - eWidth) / 2) - tooltip.space;
                            } else {
                                left = os.left + ((eWidth - tWidth) / 2) + tooltip.space;
                            }
                        }

                        if ('left' === tooltip.position || 'right' === tooltip.position) {
                            if (tHeight > eHeight) {
                                top = os.top - (tHeight - eHeight) / 2 - tooltip.space;
                            } else {
                                top = os.top + (eHeight - tHeight) / 2 + tooltip.space;
                            }
                        }

                        tooltip.style = {
                            top: top,
                            left: left,
                            position: 'absolute'
                        };

                        tooltip.$apply();
                    };

                    element.on('mouseenter', show);
                    element.on('mouseleave', hide);
                }
            };
        }
    };
});
