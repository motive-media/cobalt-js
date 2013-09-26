/*! cobalt-js - v0.3.3 - 2013-09-25 */
(function() {
    "use strict";
    angular.module("cb.directives", [ "cbSlider", "cbTooltip", "cbSelect" ]);
    angular.module("cb.utilities", [ "cb.directives" ]);
    angular.module("cbSelect", []).directive("cbSelect", function() {
        "use strict";
        return {
            restrict: "A",
            scope: {
                options: "="
            },
            template: '<div class="cb-select" tabindex="-1">' + '<div class="cb-select-value" ng-click="toggle()" ng-class="{active: show}"><span>{{ selectedItem[labelKey] || placeholder }}</span><i></i></div>' + '<div class="cb-select-options" ng-show="show">' + '<div class="cb-select-option" ng-repeat="option in options" ng-click="select(option)" ng-class="{active: option == selectedItem}">{{ option[labelKey] }}</div>' + "</div>" + "<select>" + '<option ng-repeat="o in options" value="{{ o[valueKey] }}" ng-selected="o[valueKey] == selectedItem[valueKey]">{{ o[labelKey] }}</option>' + "</select>" + "</div>",
            replace: true,
            require: "?ngModel",
            link: function(a, b, c, d) {
                var e;
                e = {
                    placeholder: "Select a value",
                    labelKey: "label",
                    valueKey: "value"
                };
                angular.extend(e, a.$eval(c.cbSelect));
                a.valueKey = e.valueKey;
                a.labelKey = e.labelKey;
                a.placeholder = e.placeholder;
                a.show = false;
                d.$render = function() {
                    a.selectedItem = d.$viewValue;
                };
                a.select = function(b) {
                    a.selectedItem = b;
                    a.show = false;
                    d.$setViewValue(b);
                };
                a.toggle = function() {
                    a.show = !a.show;
                };
                b.on("focusout", function() {
                    a.$apply(function() {
                        a.show = false;
                    });
                });
            }
        };
    });
    angular.module("cbSlider", []).directive("cbSlider", [ "$timeout", function(a) {
        "use strict";
        return {
            restrict: "A",
            scope: {
                collection: "=cbSliderData"
            },
            link: function(b, c, d) {
                var e, f, g, h, i = null, j, k;
                g = {
                    currentPage: 0,
                    perPage: 1,
                    collectionName: "pages",
                    autoPlay: false,
                    initialDelay: 7e3,
                    delay: 5e3,
                    delayFlux: 1e3
                };
                angular.extend(g, b.$eval(d.cbSlider));
                j = b.slider = {
                    currentPage: g.currentPage
                };
                b.$watch("collection", function(a) {
                    if (a === null) {
                        slide[g.collectionName] = null;
                    } else {
                        e = Math.ceil(a.length / g.perPage) - 1;
                        if (g.perPage === 1) {
                            k = a;
                        } else {
                            k = [];
                            for (var b = 0, c = a.length; b < c; b += g.perPage) {
                                k.push(a.slice(b, b + g.perPage));
                            }
                        }
                        j[g.collectionName] = k;
                    }
                });
                f = function() {
                    var b = (j.currentPage + 1) % (e + 1);
                    j.left = true;
                    j.currentPage = b;
                    i = a(f, g.delay + Math.random() * g.delayFlux);
                };
                h = function() {
                    if (g.autoPlay && i !== null) {
                        a.cancel(i);
                        i = a(f, g.initialDelay);
                    }
                };
                j.next = function() {
                    h();
                    if (j.currentPage < e) {
                        j.left = true;
                        j.currentPage++;
                    }
                };
                j.prev = function() {
                    h();
                    if (j.currentPage > 0) {
                        j.left = false;
                        j.currentPage--;
                    }
                };
                j.goto = function(a) {
                    h();
                    if (a >= 0 && a <= e) {
                        if (j.currentPage < a) {
                            j.left = true;
                        } else {
                            j.left = false;
                        }
                        j.currentPage = a;
                    }
                };
                if (g.autoPlay === true) {
                    i = a(f, g.initialDelay);
                }
            }
        };
    } ]);
    angular.module("cbTooltip", []).directive("cbTooltip", [ "$compile", function(a) {
        "use strict";
        return {
            restrict: "A",
            scope: {
                title: "@title",
                content: "@content"
            },
            compile: function(b, c) {
                return {
                    post: function(b, c, d) {
                        var e, f, g, h, i, j, k, l, m;
                        e = {
                            tpl: '<div class="cb-tooltip" ng-style="style" ng-show="show">' + '<header ng-if="title">{{title}}</header>' + "<section>{{content}}</section>" + "</div>",
                            tplArrow: '<div class="arrow" ng-style="arrowStyle"></div>',
                            position: "top",
                            space: 8,
                            content: ":)"
                        };
                        f = b;
                        angular.extend(e, b.$eval(d.cbTooltip));
                        f.position = e.position;
                        f.space = e.space;
                        f.tpl = e.tpl;
                        f.show = false;
                        f.tplArrow = e.tplArrow;
                        j = angular.element(f.tpl);
                        k = angular.element(f.tplArrow);
                        l = a(j)(b);
                        m = a(k)(b);
                        c.addClass("cb-tooltip-active");
                        l.append(m);
                        l.addClass(f.position);
                        angular.element(document.body).append(l);
                        g = function() {
                            f.$apply(function() {
                                f.show = true;
                            });
                            i();
                        };
                        h = function() {
                            f.$apply(function() {
                                f.show = false;
                            });
                        };
                        i = function() {
                            var a = c.offset(), b = c.outerWidth(true), d = c.outerHeight(true), e = l.outerWidth(true), g = l.outerHeight(true), h = m.outerWidth(true), i = m.outerHeight(true), j = 0, k = 0, n = {};
                            if ("top" === f.position) {
                                j = a.top - g - f.space;
                                n.left = e / 2 - h / 2;
                            } else if ("bottom" === f.position) {
                                j = a.top + d + f.space;
                                n.left = e / 2 - h / 2;
                            } else if ("left" === f.position) {
                                k = a.left - e - f.space;
                                n.top = g / 2 - i / 2;
                            } else if ("right" === f.position) {
                                k = a.left + b + f.space;
                                n.top = g / 2 - i / 2;
                            }
                            if ("top" === f.position || "bottom" === f.position) {
                                if (e > b) {
                                    k = a.left - (e - b) / 2;
                                } else {
                                    k = a.left + (b - e) / 2;
                                }
                            }
                            if ("left" === f.position || "right" === f.position) {
                                if (g > d) {
                                    j = a.top - (g - d) / 2;
                                } else {
                                    j = a.top + (d - g) / 2;
                                }
                            }
                            f.$apply(function() {
                                f.style = {
                                    top: j,
                                    left: k
                                };
                                f.arrowStyle = n;
                            });
                        };
                        c.on("mouseenter", g);
                        c.on("mouseleave", h);
                    }
                };
            }
        };
    } ]);
})();