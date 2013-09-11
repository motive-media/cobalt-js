/*! cobalt-js - v0.1.3 - 2013-09-11 */
(function() {
    "use strict";
    angular.module("cb.directives", [ "cbSlider", "cbTooltip" ]);
    angular.module("cb.utilities", [ "cb.directives" ]);
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
    angular.module("cbTooltip", []).directive("cbTooltip", function() {
        "use strict";
        return {
            restrict: "A",
            scope: true,
            compile: function(a, b, c) {
                return {
                    post: function(a, b, c) {
                        var d, e, f, g, h;
                        d = '<div class="cb-tooltip">' + '<div class="arrow"></div>' + "{{header}}" + "<section>{{content}}</section>" + "</div>";
                        e = a.tooltip = {
                            tpl: c.tpl || d,
                            position: c.position || "top",
                            title: c.title,
                            content: c.content,
                            space: c.space || 8
                        };
                        b.addClass("cb-tooltip-active");
                        f = function() {
                            var a = e.tpl.replace(/\{\{content\}\}/gi, e.content);
                            if (e.title) {
                                a = a.replace(/\{\{header\}\}/gi, "<header>" + e.title + "</header>");
                            } else {
                                a = a.replace(/\{\{header\}\}/gi, "");
                            }
                            $("body").append(a);
                            $(".cb-tooltip").addClass(e.position);
                            h();
                        };
                        g = function() {
                            $(".cb-tooltip").remove();
                        };
                        h = function() {
                            var a = $(".cb-tooltip"), c = b.offset(), d = b.width(), f = b.height(), g = a.width(), h = a.height(), i = 0, j = 0;
                            if ("top" === e.position) {
                                i = c.top - h - e.space;
                            } else if ("bottom" === e.position) {
                                i = c.top + f + e.space;
                            } else if ("left" === e.position) {
                                j = c.left - g - e.space;
                            } else if ("right" === e.position) {
                                j = c.left + d + e.space;
                            }
                            if ("top" === e.position || "bottom" === e.position) {
                                if (g > d) {
                                    j = c.left - (g - d) / 2 - e.space;
                                } else {
                                    j = c.left + (d - g) / 2 + e.space;
                                }
                            }
                            if ("left" === e.position || "right" === e.position) {
                                if (h > f) {
                                    i = c.top - (h - f) / 2 - e.space;
                                } else {
                                    i = c.top + (f - h) / 2 + e.space;
                                }
                            }
                            a.css({
                                top: i,
                                left: j,
                                position: "absolute"
                            });
                        };
                        b.on("mouseenter", f);
                        b.on("mouseleave", g);
                    }
                };
            }
        };
    });
})();