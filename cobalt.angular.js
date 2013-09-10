"use strict";

angular.module("cb.utilities", [ "cb.directives" ]);

"use strict";

angular.module("cb.directives", []);

(function(a) {
    "use strict";
    if (typeof define === "function" && define.amd) {
        define([ "angular" ], a);
    } else {
        a(angular);
    }
})(function(a) {
    "use strict";
    a.module("cbSlider", []).directive("cbSlider", [ "$timeout", function(b) {
        return {
            restrict: "A",
            scope: {
                collection: "=cbSliderData"
            },
            link: function(c, d, e) {
                var f, g, h, i, j = null, k, l;
                h = {
                    currentPage: 0,
                    perPage: 1,
                    collectionName: "pages",
                    autoPlay: false,
                    initialDelay: 7e3,
                    delay: 5e3,
                    delayFlux: 1e3
                };
                a.extend(h, c.$eval(e["cbSlider"]));
                k = c.slider = {
                    currentPage: h.currentPage
                };
                c.$watch("collection", function(a) {
                    f = Math.ceil(a.length / h.perPage) - 1;
                    if (h.perPage === 1) {
                        l = a;
                    } else {
                        l = [];
                        for (var b = 0, c = a.length; b < c; b += h.perPage) {
                            l.push(a.slice(b, b + h.perPage));
                        }
                    }
                    k[h.collectionName] = l;
                });
                g = function() {
                    var a = (k.currentPage + 1) % (f + 1);
                    k.left = true;
                    k.currentPage = a;
                    j = b(g, h.delay + Math.random() * h.delayFlux);
                };
                i = function() {
                    if (h.autoPlay && j != null) {
                        b.cancel(j);
                        j = b(g, h.initialDelay);
                    }
                };
                k.next = function() {
                    i();
                    if (k.currentPage < f) {
                        k.left = true;
                        k.currentPage++;
                    }
                };
                k.prev = function() {
                    i();
                    if (k.currentPage > 0) {
                        k.left = false;
                        k.currentPage--;
                    }
                };
                k.goto = function(a) {
                    i();
                    if (a >= 0 && a <= f) {
                        if (k.currentPage < a) {
                            k.left = true;
                        } else {
                            k.left = false;
                        }
                        k.currentPage = a;
                    }
                };
                if (h.autorotate === true) {
                    j = b(g, h.initialDelay);
                }
            }
        };
    } ]);
});