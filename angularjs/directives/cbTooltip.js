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
 angular.module('cbTooltip', []).directive('cbTooltip', function () {
    'use strict';

    return {
        restrict: 'A',
        scope: true,
        compile: function (scope, element, attrs) {
            return {
                post: function (scope, element, attrs) {
                    var options, defaultTpl, tooltip, show, hide, setPosition;

                    defaultTpl = '<div class="cb-tooltip">' +
                        '<div class="arrow"></div>' +
                        '{{header}}' +
                        '<section>{{content}}</section>' +
                        '</div>';

                    options = {
                        'tpl': defaultTpl,
                        'title': false,
                        'content': ':)',
                        'space': 8,
                        'position': 'top'
                    };

                    angular.extend(options, scope.$eval(attrs.cbTooltip));

                    element.addClass('cb-tooltip-active');

                    show = function () {
                        var html = options.tpl.replace(/\{\{content\}\}/gi, options.content);

                        if (options.title) {
                            html = html.replace(/\{\{header\}\}/gi, '<header>' + options.title + '</header>');
                        } else {
                            html = html.replace(/\{\{header\}\}/gi, '');
                        }

                        $('body').append(html);

                        $('.cb-tooltip').addClass(options.position);

                        setPosition();
                    };

                    hide = function () {
                        $('.cb-tooltip').remove();
                    };

                    setPosition = function () {
                        var box = $('.cb-tooltip'),
                            os = element.offset(),
                            eWidth = element.width(),
                            eHeight = element.height(),
                            tWidth = box.width(),
                            tHeight = box.height(),
                            top = 0,
                            left = 0;

                        var ePadding = {
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

                        if ('top' === options.position) {
                            top = os.top - tHeight - options.space;
                        } else if ('bottom' === options.position) {
                            top = os.top + eHeight + options.space;
                        } else if ('left' === options.position) {
                            left = os.left - tWidth - options.space;
                        } else if ('right' === options.position) {
                            left = os.left + eWidth + options.space;
                        }

                        if ('top' === options.position || 'bottom' === options.position) {
                            if (tWidth > eWidth) {
                                left = os.left - ((tWidth - eWidth) / 2) - options.space;
                            } else {
                                left = os.left + ((eWidth - tWidth) / 2) + options.space;
                            }
                        }

                        if ('left' === options.position || 'right' === options.position) {
                            if (tHeight > eHeight) {
                                top = os.top - (tHeight - eHeight) / 2 - options.space;
                            } else {
                                top = os.top + (eHeight - tHeight) / 2 + options.space;
                            }
                        }

                        box.css({
                            top: top,
                            left: left,
                            position: 'absolute'
                        });
                    };

                    element.on('mouseenter', show);
                    element.on('mouseleave', hide);
                }
            };
        }
    };
});
