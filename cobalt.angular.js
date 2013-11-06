/*! cobalt-js - v0.6.6 - 2013-11-06 */
(function() {
    "use strict";
    angular.module("cb.directives", [ "cbSlider", "cbTooltip", "cbSelect", "cbSelectReplace" ]);
    angular.module("cb.utilities", [ "cb.directives" ]);
    angular.module("cbSelect", []).directive("cbSelect", function() {
        "use strict";
        return {
            restrict: "A",
            scope: {
                ngModel: "=",
                options: "="
            },
            template: '<div class="cb-select" tabindex="0">' + '<div class="cb-select-value" ng-click="select.open()" ng-class="{active: select.show}" title="{{ select.selectedItem[labelKey] }}"><span>{{ select.selectedItem[labelKey] || placeholder }}</span><i></i></div>' + '<div class="cb-select-options" ng-show="select.show">' + '<div class="cb-select-option" ng-repeat="option in select.options" ng-click="select.selectOption(option)" ng-class="{active: option == select.selectedItem}">{{ option[labelKey] }}</div>' + "</div>" + '<select ng-hide="true">' + '<option ng-repeat="o in select.options" value="{{ o[valueKey] }}" ng-selected="o[valueKey] == select.selectedItem[valueKey]">{{ o[labelKey] }}</option>' + "</select>" + "</div>",
            replace: true,
            link: function(a, b, c) {
                var d, e, f, g = -1;
                e = {
                    placeholder: "Select a value",
                    labelKey: "label",
                    valueKey: "value"
                };
                angular.extend(e, a.$eval(c.cbSelect));
                a.valueKey = e.valueKey;
                a.labelKey = e.labelKey;
                a.placeholder = e.placeholder;
                d = a.options;
                f = a.select = {
                    show: false,
                    focused: false,
                    options: d,
                    selectedItem: null,
                    selectOption: function(a) {
                        g = jQuery.inArray(a, d);
                        f.selectedItem = a;
                        f.close();
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
                a.$watch("select.selectedItem", function(b) {
                    if (b) {
                        a.ngModel = b;
                    }
                });
                b.on("click", function(a) {
                    if (!angular.element(a.target).hasClass("cb-select-option")) {
                        b.trigger("focus");
                    }
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
    });
    angular.module("cbSelectReplace", []).directive("cbSelectReplace", [ "$compile", "$rootScope", function(a, b) {
        "use strict";
        return {
            restrict: "CA",
            scope: true,
            require: "?ngModel",
            compile: function(a, b) {
                var c, d = [], e = 0, f, g, h;
                f = a.get(0).nodeName.toLowerCase() === "select" ? a : a.find("select");
                g = f.attr("name") || "";
                h = f.attr("tabindex") || 0;
                c = '<div class="cb-select" tabindex="' + h + '">' + '<div class="cb-select-value" ng-click="select.open()" ng-class="{active: select.show}" title="{{ select.selectedItem.label }}"><span>{{ select.selectedItem.label }}</span><i></i></div>' + '<div class="cb-select-options" ng-show="select.show">' + '<div class="cb-select-option" ng-repeat="option in select.options" ng-mousedown="select.selectOption(option)" ng-class="{active: option == select.selectedItem}">{{ option.label }}</div>' + "</div>" + '<select ng-hide="true" name="' + g + '">' + '<option ng-repeat="o in select.options" value="{{ o.value }}" ng-selected="o.value == select.selectedItem.value">{{ o.label }}</option>' + "</select>" + "</div>";
                angular.forEach(f.find("option"), function(a, b) {
                    a = angular.element(a);
                    d.push({
                        label: a.text(),
                        value: a.val()
                    });
                    if (a.attr("selected") === "selected") {
                        e = b;
                    }
                });
                f.replaceWith(angular.element(c));
                return {
                    pre: function(a, b, c, f) {
                        var g, h = e;
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
    } ]);
    angular.module("cbSlider", []).directive("cbSlider", [ "$timeout", function(a) {
        "use strict";
        return {
            restrict: "A",
            scope: true,
            require: "ngModel",
            link: function(b, c, d, e) {
                var f, g, h, i = null, j, k;
                g = {
                    defaultPage: 0,
                    perPage: 1,
                    collectionName: "pages",
                    autoPlay: false,
                    initialDelay: 7e3,
                    delay: 5e3,
                    delayFlux: 1e3
                };
                angular.extend(g, b.$eval(d.cbSlider));
                j = b.slider = {
                    lastPage: null,
                    left: null,
                    currentPage: g.defaultPage,
                    perPage: g.perPage,
                    onPage: function(a) {
                        return a === j.currentPage;
                    },
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
                    var a = e.$modelValue;
                    if (!angular.isDefined(a)) {
                        j[g.collectionName] = null;
                    } else {
                        j.lastPage = Math.ceil(a.length / g.perPage) - 1;
                        if (j.currentPage > j.lastPage) {
                            j.currentPage = j.lastPage;
                        }
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
    angular.module("cbTooltip", []).directive("cbTooltip", [ "$compile", "$document", function(a, b) {
        "use strict";
        return {
            restrict: "A",
            scope: {
                title: "@title",
                content: "@content"
            },
            compile: function(c, d) {
                return {
                    post: function(c, d, e) {
                        var f, g, h, i, j, k, l, m, n;
                        f = {
                            tpl: '<div class="cb-tooltip" ng-style="style" ng-show="show">' + '<header ng-if="title">{{title}}</header>' + "<section>{{content}}</section>" + "</div>",
                            tplArrow: '<div class="arrow" ng-style="arrowStyle"></div>',
                            position: "top",
                            space: 8,
                            content: ":)"
                        };
                        g = c;
                        angular.extend(f, c.$eval(e.cbTooltip));
                        g.position = f.position;
                        g.space = f.space;
                        g.tpl = f.tpl;
                        g.show = false;
                        g.tplArrow = f.tplArrow;
                        k = angular.element(g.tpl);
                        l = angular.element(g.tplArrow);
                        m = a(k)(c);
                        n = a(l)(c);
                        d.addClass("cb-tooltip-active");
                        m.append(n);
                        m.addClass(g.position);
                        b.find("body").append(m);
                        h = g.show = function() {
                            g.$apply(function() {
                                g.show = true;
                            });
                            j();
                        };
                        i = g.hide = function() {
                            g.$apply(function() {
                                g.show = false;
                            });
                        };
                        j = function() {
                            var a = d.offset(), b = d.outerWidth(true), c = d.outerHeight(true), e = m.outerWidth(true), f = m.outerHeight(true), h = n.outerWidth(true), i = n.outerHeight(true), j = 0, k = 0, l = {};
                            if ("top" === g.position) {
                                j = a.top - f - g.space;
                                l.left = e / 2 - h / 2;
                            } else if ("bottom" === g.position) {
                                j = a.top + c + g.space;
                                l.left = e / 2 - h / 2;
                            } else if ("left" === g.position) {
                                k = a.left - e - g.space;
                                l.top = f / 2 - i / 2;
                            } else if ("right" === g.position) {
                                k = a.left + b + g.space;
                                l.top = f / 2 - i / 2;
                            }
                            if ("top" === g.position || "bottom" === g.position) {
                                if (e > b) {
                                    k = a.left - (e - b) / 2;
                                } else {
                                    k = a.left + (b - e) / 2;
                                }
                            }
                            if ("left" === g.position || "right" === g.position) {
                                if (f > c) {
                                    j = a.top - (f - c) / 2;
                                } else {
                                    j = a.top + (c - f) / 2;
                                }
                            }
                            g.$apply(function() {
                                g.style = {
                                    top: j,
                                    left: k
                                };
                                g.arrowStyle = l;
                            });
                        };
                        d.on("mouseenter", h);
                        d.on("mouseleave", i);
                        c.$on("$destroy", function() {
                            m.remove();
                        });
                    }
                };
            }
        };
    } ]);
})();