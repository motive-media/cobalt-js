angular.module('cbTooltip', []).directive('cbTooltip', function () {
    'use strict';

    return {
        restrict: 'A',
        scope: true,
        compile: function (scope, element, attrs) {
            return {
                post: function (scope, element, attrs) {
                    var defaultTpl, tooltip, show, hide, setPosition;

                    defaultTpl = '<div class="cb-tooltip">' +
                        '<div class="arrow"></div>' +
                        '{{header}}' +
                        '<section>{{content}}</section>' +
                        '</div>';

                    tooltip = scope.tooltip = {
                        tpl: attrs.tpl || defaultTpl,
                        position: attrs.position || 'top',
                        title: attrs.title,
                        content: attrs.content,
                        space: attrs.space || 8
                    };

                    element.addClass('cb-tooltip-active');

                    show = function () {
                        var html = tooltip.tpl.replace(/\{\{content\}\}/gi, tooltip.content);

                        if (tooltip.title) {
                            html = html.replace(/\{\{header\}\}/gi, '<header>' + tooltip.title + '</header>');
                        } else {
                            html = html.replace(/\{\{header\}\}/gi, '');
                        }

                        $('body').append(html);

                        $('.cb-tooltip').addClass(tooltip.position);

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
