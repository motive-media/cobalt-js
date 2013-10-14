/*! cobalt-js - v0.6.2 - 2013-10-14 */
(function() {
    "use strict";
    angular.module("cb.directives", [ "cbSlider", "cbTooltip", "cbSelect", "cbSelectReplace" ]);
    angular.module("cb.utilities", [ "cb.directives" ]);
    angular.module("cbSelect", []).directive("cbSelect", function() {
        "use strict";
        return {
            restrict: "A",
            scope: {
                options: "="
            },
            template: '<div class="cb-select" tabindex="0">' + '<div class="cb-select-value" ng-click="select.open()" ng-class="{active: select.show}" title="{{ select.selectedItem[labelKey] }}"><span>{{ select.selectedItem[labelKey] || placeholder }}</span><i></i></div>' + '<div class="cb-select-options" ng-show="select.show">' + '<div class="cb-select-option" ng-repeat="option in select.options" ng-click="select.selectOption(option)" ng-class="{active: option == select.selectedItem}">{{ option[labelKey] }}</div>' + "</div>" + '<select ng-hide="true">' + '<option ng-repeat="o in select.options" value="{{ o[valueKey] }}" ng-selected="o[valueKey] == select.selectedItem[valueKey]">{{ o[labelKey] }}</option>' + "</select>" + "</div>",
            replace: true,
            require: "?ngModel",
            link: function(a, b, c, d) {
                var e, f, g, h = 0;
                f = {
                    placeholder: "Select a value",
                    labelKey: "label",
                    valueKey: "value"
                };
                angular.extend(f, a.$eval(c.cbSelect));
                a.valueKey = f.valueKey;
                a.labelKey = f.labelKey;
                a.placeholder = f.placeholder;
                a.show = false;
                e = a.options;
                g = a.select = {
                    show: false,
                    focused: false,
                    options: e,
                    selectedItem: e[0],
                    selectOption: function(a) {
                        h = jQuery.inArray(a, e);
                        g.selectedItem = a;
                        g.close();
                        if (d) {
                            d.$setViewValue(a);
                        }
                    },
                    toggle: function() {
                        g.show = !g.show;
                    },
                    open: function() {
                        g.show = true;
                    },
                    close: function() {
                        g.show = false;
                    },
                    scrollIntoView: function() {
                        var a, c;
                        a = b.find(".cb-select-options");
                        c = b.find(".cb-select-option").eq(h);
                        if (c.position().top + c.outerHeight() > a.height()) {
                            a.scrollTop(a.scrollTop() + c.outerHeight() + c.position().top - a.height());
                        } else if (c.position().top < 0) {
                            a.scrollTop(a.scrollTop() + c.position().top);
                        }
                    },
                    nextOption: function() {
                        if (h < e.length - 1) {
                            g.selectedItem = e[++h];
                            g.scrollIntoView();
                        }
                    },
                    prevOption: function() {
                        if (h > 0) {
                            g.selectedItem = e[--h];
                            g.scrollIntoView();
                        }
                    },
                    keypress: function(a) {
                        if (a.keyCode === 40) {
                            g.nextOption();
                        } else if (a.keyCode === 38) {
                            g.prevOption();
                        } else if (a.keyCode === 13) {
                            g.toggle();
                        }
                    }
                };
                if (d) {
                    d.$render = function() {
                        a.selectedItem = d.$viewValue;
                    };
                }
                b.on("click", function() {
                    b.trigger("focus");
                });
                b.on("focus", function() {
                    a.$apply(function() {
                        g.open();
                    });
                });
                b.on("focusout", function() {
                    a.$apply(function() {
                        g.close();
                    });
                });
                b.on("keydown", function(b) {
                    if (b.keyCode !== 9) {
                        b.preventDefault();
                    }
                    a.$apply(function() {
                        g.keypress(b);
                    });
                });
            }
        };
    });
    angular.module("cbSelectReplace", []).directive("cbSelectReplace", function() {
        "use strict";
        return {
            restrict: "CA",
            scope: true,
            require: "?ngModel",
            compile: function(a, b) {
                var c, d = [], e = 0;
                c = '<div class="cb-select" tabindex="0">' + '<div class="cb-select-value" ng-click="select.open()" ng-class="{active: select.show}" title="{{ select.selectedItem.label }}"><span>{{ select.selectedItem.label }}</span><i></i></div>' + '<div class="cb-select-options" ng-show="select.show">' + '<div class="cb-select-option" ng-repeat="option in select.options" ng-mousedown="select.selectOption(option)" ng-class="{active: option == select.selectedItem}">{{ option.label }}</div>' + "</div>" + '<select ng-hide="true">' + '<option ng-repeat="o in select.options" value="{{ o.value }}" ng-selected="o.value == select.selectedItem.value">{{ o.label }}</option>' + "</select>" + "</div>";
                angular.forEach(a.find("option"), function(a, b) {
                    a = angular.element(a);
                    d.push({
                        label: a.text(),
                        value: a.val()
                    });
                    if (a.attr("selected") === "selected") {
                        e = b;
                    }
                });
                a.replaceWith(angular.element(c));
                return {
                    post: function(a, b, c, f) {
                        var g, h = 0;
                        g = a.select = {
                            show: false,
                            focused: false,
                            options: d,
                            selectedItem: d[e],
                            selectOption: function(a) {
                                h = jQuery.inArray(a, d);
                                g.selectedItem = a;
                                g.close();
                                if (f) {
                                    f.$setViewValue(a);
                                }
                            },
                            toggle: function() {
                                g.show = !g.show;
                            },
                            open: function() {
                                g.show = true;
                            },
                            close: function() {
                                g.show = false;
                            },
                            scrollIntoView: function() {
                                var a, c;
                                a = b.find(".cb-select-options");
                                c = b.find(".cb-select-option").eq(h);
                                if (c.position().top + c.outerHeight() > a.height()) {
                                    a.scrollTop(a.scrollTop() + c.outerHeight() + c.position().top - a.height());
                                } else if (c.position().top < 0) {
                                    a.scrollTop(a.scrollTop() + c.position().top);
                                }
                            },
                            nextOption: function() {
                                if (h < d.length - 1) {
                                    g.selectedItem = d[++h];
                                    g.scrollIntoView();
                                }
                            },
                            prevOption: function() {
                                if (h > 0) {
                                    g.selectedItem = d[--h];
                                    g.scrollIntoView();
                                }
                            },
                            keypress: function(a) {
                                if (a.keyCode === 40) {
                                    g.nextOption();
                                } else if (a.keyCode === 38) {
                                    g.prevOption();
                                } else if (a.keyCode === 13) {
                                    g.toggle();
                                }
                            }
                        };
                        if (f) {
                            f.$render = function() {
                                g.selectedItem = f.$viewValue;
                            };
                        }
                        b.on("click", function() {
                            b.trigger("focus");
                        });
                        b.on("focus", function() {
                            a.$apply(function() {
                                g.focused = true;
                                g.open();
                            });
                        });
                        b.on("focusout", function() {
                            a.$apply(function() {
                                g.focused = false;
                                g.close();
                            });
                        });
                        b.on("keydown", function(b) {
                            if (b.keyCode !== 9) {
                                b.preventDefault();
                            }
                            a.$apply(function() {
                                g.keypress(b);
                            });
                        });
                    }
                };
            }
        };
    });
    angular.module("cbSlider", []).directive("cbSlider", [ "$timeout", function(a) {
        "use strict";
        return {
            restrict: "A",
            scope: true,
            require: "ngModel",
            link: function(b, c, d, e) {
                var f, g, h, i = null, j, k;
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
                    currentPage: g.currentPage,
                    next: function() {
                        h();
                        if (j.currentPage < j.lastPage) {
                            j.left = true;
                            j.currentPage++;
                        }
                    },
                    prev: function() {
                        h();
                        if (j.currentPage > 0) {
                            j.left = false;
                            j.currentPage--;
                        }
                    },
                    "goto": function(a) {
                        h();
                        if (a >= 0 && a <= j.lastPage) {
                            if (j.currentPage < a) {
                                j.left = true;
                            } else {
                                j.left = false;
                            }
                            j.currentPage = a;
                        }
                    }
                };
                e.$render = function() {
                    var a = e.$viewValue;
                    if (!angular.isDefined(a)) {
                        j[g.collectionName] = null;
                    } else {
                        j.lastPage = Math.ceil(a.length / g.perPage) - 1;
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
                };
                f = function() {
                    var b = (j.currentPage + 1) % (j.lastPage + 1);
                    j.left = true;
                    j.currentPage = b;
                    i = a(f, g.delay + Math.random() * g.delayFlux);
                };
                h = g.autoPlay ? function() {
                    if (i !== null) {
                        a.cancel(i);
                        i = a(f, g.initialDelay);
                    }
                } : angular.noop;
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
                        g = f.show = function() {
                            f.$apply(function() {
                                f.show = true;
                            });
                            i();
                        };
                        h = f.hide = function() {
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
                        b.$on("$destroy", function() {
                            l.remove();
                        });
                    }
                };
            }
        };
    } ]);
})();