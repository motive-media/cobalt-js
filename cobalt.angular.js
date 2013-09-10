/*! cobalt-js - v0.1.2 - 2013-09-10 */
(function() {
    "use strict";
    angular.module("cb.directives", []);
    angular.module("cb.utilities", [ "cb.directives" ]);
    angular.module("cb.directives").directive("cbSlider", [ "$timeout", function(a) {
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
                if (g.autorotate === true) {
                    i = a(f, g.initialDelay);
                }
            }
        };
    } ]);
})();
