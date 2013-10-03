/*! cobalt-js - v0.5.3 - 2013-10-03 */
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
                var c, d = [];
                c = '<div class="cb-select" tabindex="0">' + '<div class="cb-select-value" ng-click="select.open()" ng-class="{active: select.show}" title="{{ select.selectedItem.label }}"><span>{{ select.selectedItem.label }}</span><i></i></div>' + '<div class="cb-select-options" ng-show="select.show">' + '<div class="cb-select-option" ng-repeat="option in select.options" ng-mousedown="select.selectOption(option)" ng-class="{active: option == select.selectedItem}">{{ option.label }}</div>' + "</div>" + '<select ng-hide="true">' + '<option ng-repeat="o in select.options" value="{{ o.value }}" ng-selected="o.value == select.selectedItem.value">{{ o.label }}</option>' + "</select>" + "</div>";
                angular.forEach(a.children(), function(a) {
                    a = angular.element(a);
                    d.push({
                        label: a.text(),
                        value: a.val()
                    });
                });
                a.replaceWith(angular.element(c));
                return {
                    post: function(a, b, c, e) {
                        var f, g = 0;
                        f = a.select = {
                            show: false,
                            focused: false,
                            options: d,
                            selectedItem: d[0],
                            selectOption: function(a) {
                                g = jQuery.inArray(a, d);
                                f.selectedItem = a;
                                f.close();
                                if (e) {
                                    e.$setViewValue(a);
                                }
                            },
                            toggle: function() {
                                f.show = !f.show;
                            },
                            open: function() {
                                f.show = true;
                            },
                            close: function() {
                                f.show = false;
                            },
                            scrollIntoView: function() {
                                var a, c;
                                a = b.find(".cb-select-options");
                                c = b.find(".cb-select-option").eq(g);
                                if (c.position().top + c.outerHeight() > a.height()) {
                                    a.scrollTop(a.scrollTop() + c.outerHeight() + c.position().top - a.height());
                                } else if (c.position().top < 0) {
                                    a.scrollTop(a.scrollTop() + c.position().top);
                                }
                            },
                            nextOption: function() {
                                if (g < d.length - 1) {
                                    f.selectedItem = d[++g];
                                    f.scrollIntoView();
                                }
                            },
                            prevOption: function() {
                                if (g > 0) {
                                    f.selectedItem = d[--g];
                                    f.scrollIntoView();
                                }
                            },
                            keypress: function(a) {
                                if (a.keyCode === 40) {
                                    f.nextOption();
                                } else if (a.keyCode === 38) {
                                    f.prevOption();
                                } else if (a.keyCode === 13) {
                                    f.toggle();
                                }
                            }
                        };
                        if (e) {
                            e.$render = function() {
                                f.selectedItem = e.$viewValue;
                            };
                        }
                        b.on("click", function() {
                            b.trigger("focus");
                        });
                        b.on("focus", function() {
                            a.$apply(function() {
                                f.focused = true;
                                f.open();
                            });
                        });
                        b.on("focusout", function() {
                            a.$apply(function() {
                                f.focused = false;
                                f.close();
                            });
                        });
                        b.on("keydown", function(b) {
                            if (b.keyCode !== 9) {
                                b.preventDefault();
                            }
                            a.$apply(function() {
                                f.keypress(b);
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
            scope: {
                collection: "=cbSliderData"
            },
            link: function(b, c, d) {
                var e, f, g, h = null, i, j;
                f = {
                    currentPage: 0,
                    perPage: 1,
                    collectionName: "pages",
                    autoPlay: false,
                    initialDelay: 7e3,
                    delay: 5e3,
                    delayFlux: 1e3
                };
                angular.extend(f, b.$eval(d.cbSlider));
                i = b.slider = {
                    currentPage: f.currentPage,
                    next: function() {
                        g();
                        if (i.currentPage < i.lastPage) {
                            i.left = true;
                            i.currentPage++;
                        }
                    },
                    prev: function() {
                        g();
                        if (i.currentPage > 0) {
                            i.left = false;
                            i.currentPage--;
                        }
                    },
                    "goto": function(a) {
                        g();
                        if (a >= 0 && a <= i.lastPage) {
                            if (i.currentPage < a) {
                                i.left = true;
                            } else {
                                i.left = false;
                            }
                            i.currentPage = a;
                        }
                    }
                };
                b.$watch("collection", function(a) {
                    if (a === null) {
                        slide[f.collectionName] = null;
                    } else {
                        i.lastPage = Math.ceil(a.length / f.perPage) - 1;
                        if (f.perPage === 1) {
                            j = a;
                        } else {
                            j = [];
                            for (var b = 0, c = a.length; b < c; b += f.perPage) {
                                j.push(a.slice(b, b + f.perPage));
                            }
                        }
                        i[f.collectionName] = j;
                    }
                });
                e = function() {
                    var b = (i.currentPage + 1) % (i.lastPage + 1);
                    i.left = true;
                    i.currentPage = b;
                    h = a(e, f.delay + Math.random() * f.delayFlux);
                };
                g = f.autoPlay ? function() {
                    if (h !== null) {
                        a.cancel(h);
                        h = a(e, f.initialDelay);
                    }
                } : angular.noop;
                if (f.autoPlay === true) {
                    h = a(e, f.initialDelay);
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