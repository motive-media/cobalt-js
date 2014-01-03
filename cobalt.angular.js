/*! cobalt-js - v0.7.1 - 2014-01-03 */
(function() {
    "use strict";
    angular.module("cb.directives", [ "cbSlider", "cbTooltip", "cbSelect", "cbSelectReplace" ]);
    angular.module("cb.utilities", [ "cb.directives" ]);
    angular.module("cbSelect", []).directive("cbSelect", [ "$compile", "$filter", "$timeout", function(a, b, c) {
        "use strict";
        return {
            restrict: "A",
            scope: {
                ngModel: "=",
                options: "="
            },
            template: '<div class="cb-select" tabindex="0">' + '<div class="cb-select-value" ng-click="select.toggle()" ng-class="{active: select.show}" title="{{ select.selectedItem[labelKey] }}"><span>{{ select.selectedItem[labelKey] || placeholder }}</span><i></i></div>' + '<div class="cb-select-dropdown" ng-show="select.show">' + '<div class="cb-select-options">' + '<div class="cb-select-option" ng-repeat="option in select.options" ng-click="select.selectOption(option)" ng-class="{active: option == select.selectedItem}">{{ option[labelKey] }}</div>' + "</div>" + '<select ng-hide="true">' + '<option ng-repeat="o in select.options" value="{{ o[valueKey] }}" ng-selected="o[valueKey] == select.selectedItem[valueKey]">{{ o[labelKey] }}</option>' + "</select>" + "</div></div>",
            replace: true,
            link: function(d, e, f) {
                var g, h, i, j = -1, k, l;
                h = {
                    placeholder: "Select a value",
                    labelKey: "label",
                    valueKey: "value",
                    search: false
                };
                angular.extend(h, d.$eval(f.cbSelect));
                d.valueKey = h.valueKey;
                d.labelKey = h.labelKey;
                d.placeholder = h.placeholder;
                if (h.search) {
                    e.find(".cb-select-dropdown").prepend(a('<div class="cb-select-search"><input type="text" ng-model="select.search"/></div>')(d));
                }
                g = d.options;
                i = d.select = {
                    show: false,
                    focused: false,
                    options: g,
                    selectedItem: null,
                    selectOption: function(a) {
                        j = jQuery.inArray(a, g);
                        i.selectedItem = a;
                        i.close();
                    },
                    toggle: function() {
                        i.show = !i.show;
                    },
                    open: function() {
                        i.show = true;
                    },
                    close: function() {
                        i.show = false;
                    },
                    scrollIntoView: function() {
                        var a, b;
                        a = e.find(".cb-select-options");
                        b = e.find(".cb-select-option").eq(j);
                        if (b.position().top + b.outerHeight() > a.height()) {
                            a.scrollTop(a.scrollTop() + b.outerHeight() + b.position().top - a.height());
                        } else if (b.position().top < 0) {
                            a.scrollTop(a.scrollTop() + b.position().top);
                        }
                    },
                    nextOption: function() {
                        if (j < g.length - 1) {
                            i.selectedItem = i.options[++j];
                            i.scrollIntoView();
                        }
                    },
                    prevOption: function() {
                        if (j > 0) {
                            i.selectedItem = i.options[--j];
                            i.scrollIntoView();
                        }
                    },
                    keypress: function(a) {
                        if (a.keyCode === 40) {
                            i.nextOption();
                        } else if (a.keyCode === 38) {
                            i.prevOption();
                        } else if (a.keyCode === 13) {
                            i.toggle();
                        } else if (h.search && /^[a-z0-9]+$/i.test(String.fromCharCode(a.keyCode)) && a.target !== k.get(0)) {
                            i.open();
                            c(function() {
                                k.focus();
                                i.search = String.fromCharCode(a.keyCode).toLowerCase();
                            }, 15);
                        }
                    }
                };
                d.$watch("select.search", function(a) {
                    if (!a) {
                        i.selectedItem = null;
                        return;
                    }
                    i.options = b("filter")(g, a);
                    var d = i.options.indexOf(i.selectedItem);
                    if (d > -1) {
                        i.selectedItem = i.options[j = d];
                        if (i.show) {
                            c(function() {
                                i.scrollIntoView();
                            }, 10);
                        }
                    } else {
                        i.selectedItem = i.options[j = 0];
                    }
                });
                d.$watch("select.selectedItem", function(a) {
                    if (a) {
                        d.ngModel = a;
                    }
                });
                k = e.find(".cb-select-search>input");
                l = e.find(".cb-select-option");
                e.on("click", ".cb-select-value", function(a) {
                    e.trigger("focus");
                });
                e.on("focusout", function(a) {
                    if (k.length > 0 ? a.relatedTarget !== k.get(0) : true) {
                        d.$apply(function() {
                            i.focused = false;
                            i.close();
                        });
                    }
                });
                k.on("focusout", function(a) {
                    d.$apply(function() {
                        i.focused = false;
                        i.close();
                    });
                });
                e.on("keydown", function(a) {
                    if ([ 38, 40 ].indexOf(a.keyCode) > 0) {
                        a.preventDefault();
                    }
                    d.$apply(function() {
                        i.keypress(a);
                    });
                });
            }
        };
    } ]);
    angular.module("cbSelectReplace", []).directive("cbSelectReplace", [ "$compile", "$rootScope", "$filter", "$timeout", function(a, b, c, d) {
        "use strict";
        return {
            restrict: "CA",
            scope: true,
            require: "?ngModel",
            compile: function(a, e) {
                var f, g = [], h = 0, i, j, k, l;
                l = b.$eval(e.cbSelectReplace) || {};
                i = a.get(0).nodeName.toLowerCase() === "select" ? a : a.find("select");
                j = i.attr("name") || "";
                k = i.attr("tabindex") || 0;
                f = '<div class="cb-select" tabindex="' + k + '">' + '<div class="cb-select-value" ng-click="select.toggle()" ng-class="{active: select.show}" title="{{ select.selectedItem.label }}"><span>{{ select.selectedItem.label }}</span><i></i></div>' + '<div class="cb-select-dropdown" ng-show="select.show">' + (l.search ? '<div class="cb-select-search"><input type="text" ng-model="select.search"/></div>' : "") + '<div class="cb-select-options">' + '<div class="cb-select-option" ng-repeat="option in select.options" ng-mousedown="select.selectOption(option)" ng-class="{active: option == select.selectedItem}">{{ option.label }}</div>' + "</div>" + '<select ng-hide="true" name="' + j + '">' + '<option ng-repeat="o in select.options" value="{{ o.value }}" ng-selected="o.value == select.selectedItem.value">{{ o.label }}</option>' + "</select>" + "</div></div>";
                angular.forEach(i.find("option"), function(a, b) {
                    a = angular.element(a);
                    g.push({
                        label: a.text(),
                        value: a.val()
                    });
                    if (a.attr("selected") === "selected") {
                        h = b;
                    }
                });
                i.replaceWith(angular.element(f));
                return {
                    pre: function(a, b, e, f) {
                        var i, j = h, k, m;
                        i = a.select = {
                            show: false,
                            focused: false,
                            options: g,
                            selectedItem: g[h],
                            selectOption: function(a) {
                                j = jQuery.inArray(a, g);
                                i.selectedItem = a;
                                i.close();
                            },
                            toggle: function() {
                                if (i.show) {
                                    i.close();
                                } else {
                                    i.open();
                                }
                            },
                            open: function() {
                                i.show = true;
                                d(function() {
                                    i.scrollIntoView();
                                }, 15);
                            },
                            close: function() {
                                i.show = false;
                                i.search = "";
                            },
                            scrollIntoView: function() {
                                var a, c;
                                a = b.find(".cb-select-options");
                                c = b.find(".cb-select-option").eq(j);
                                if (c.position().top + c.outerHeight() > a.height()) {
                                    a.scrollTop(a.scrollTop() + c.outerHeight() + c.position().top - a.height());
                                } else if (c.position().top < 0) {
                                    a.scrollTop(a.scrollTop() + c.position().top);
                                }
                            },
                            nextOption: function() {
                                if (j < i.options.length - 1) {
                                    i.selectedItem = i.options[++j];
                                    i.scrollIntoView();
                                }
                            },
                            prevOption: function() {
                                if (j > 0) {
                                    i.selectedItem = i.options[--j];
                                    i.scrollIntoView();
                                }
                            },
                            keypress: function(a) {
                                if (a.keyCode === 40) {
                                    i.open();
                                    i.nextOption();
                                } else if (a.keyCode === 38) {
                                    i.open();
                                    i.prevOption();
                                } else if (a.keyCode === 13) {
                                    i.toggle();
                                } else if (l.search && /^[a-z0-9]+$/i.test(String.fromCharCode(a.keyCode)) && a.target !== k.get(0)) {
                                    i.open();
                                    d(function() {
                                        k.focus();
                                        i.search = String.fromCharCode(a.keyCode).toLowerCase();
                                    }, 15);
                                }
                            }
                        };
                        a.$watch("select.search", function(a) {
                            i.options = c("filter")(g, a);
                            var b = i.options.indexOf(i.selectedItem);
                            if (b > -1) {
                                i.selectedItem = i.options[j = b];
                                if (i.show) {
                                    d(function() {
                                        i.scrollIntoView();
                                    }, 10);
                                }
                            } else {
                                i.selectedItem = i.options[j = 0];
                            }
                        });
                        if (f) {
                            f.$render = function() {
                                i.selectedItem = f.$viewValue;
                            };
                            a.$watch("select.selectedItem", function(a) {
                                f.$setViewValue(a);
                            });
                        }
                        k = b.find(".cb-select-search>input");
                        m = b.find(".cb-select-option");
                        b.on("click", ".cb-select-value", function(a) {
                            b.trigger("focus");
                        });
                        b.on("focusout", function(b) {
                            if (k.length > 0 ? b.relatedTarget !== k.get(0) : true) {
                                a.$apply(function() {
                                    i.focused = false;
                                    i.close();
                                });
                            }
                        });
                        k.on("focusout", function(b) {
                            a.$apply(function() {
                                i.focused = false;
                                i.close();
                            });
                        });
                        b.on("keydown", function(b) {
                            if ([ 38, 40 ].indexOf(b.keyCode) > 0) {
                                b.preventDefault();
                            }
                            a.$apply(function() {
                                i.keypress(b);
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
    angular.module("cbTooltip", []).directive("cbTooltip", [ "$compile", "$document", "$sce", function(a, b, c) {
        "use strict";
        return {
            restrict: "A",
            scope: {
                title: "@title"
            },
            compile: function(d, e) {
                return {
                    post: function(d, e, f) {
                        var g, h, i, j, k, l, m, n, o;
                        g = {
                            tpl: '<div class="cb-tooltip" ng-style="style" ng-show="show">' + '<header ng-if="title">{{title}}</header>' + '<section ng-bind-html="content"></section>' + "</div>",
                            tplArrow: '<div class="arrow" ng-style="arrowStyle"></div>',
                            position: "top",
                            space: 8,
                            content: ":)"
                        };
                        h = d;
                        angular.extend(g, d.$eval(f.cbTooltip));
                        h.position = g.position;
                        h.space = g.space;
                        h.tpl = g.tpl;
                        h.show = false;
                        h.tplArrow = g.tplArrow;
                        h.content = c.trustAsHtml(f.content);
                        l = angular.element(h.tpl);
                        m = angular.element(h.tplArrow);
                        n = a(l)(d);
                        o = a(m)(d);
                        e.addClass("cb-tooltip-active");
                        n.append(o);
                        n.addClass(h.position);
                        b.find("body").append(n);
                        i = h.show = function() {
                            h.$apply(function() {
                                h.show = true;
                            });
                            k();
                        };
                        j = h.hide = function() {
                            h.$apply(function() {
                                h.show = false;
                            });
                        };
                        k = function() {
                            var a = e.offset(), b = e.outerWidth(true), c = e.outerHeight(true), d = n.outerWidth(true), f = n.outerHeight(true), g = o.outerWidth(true), i = o.outerHeight(true), j = 0, k = 0, l = {};
                            if ("top" === h.position) {
                                j = a.top - f - h.space;
                                l.left = d / 2 - g / 2;
                            } else if ("bottom" === h.position) {
                                j = a.top + c + h.space;
                                l.left = d / 2 - g / 2;
                            } else if ("left" === h.position) {
                                k = a.left - d - h.space;
                                l.top = f / 2 - i / 2;
                            } else if ("right" === h.position) {
                                k = a.left + b + h.space;
                                l.top = f / 2 - i / 2;
                            }
                            if ("top" === h.position || "bottom" === h.position) {
                                if (d > b) {
                                    k = a.left - (d - b) / 2;
                                } else {
                                    k = a.left + (b - d) / 2;
                                }
                            }
                            if ("left" === h.position || "right" === h.position) {
                                if (f > c) {
                                    j = a.top - (f - c) / 2;
                                } else {
                                    j = a.top + (c - f) / 2;
                                }
                            }
                            h.$apply(function() {
                                h.style = {
                                    top: j,
                                    left: k
                                };
                                h.arrowStyle = l;
                            });
                        };
                        e.on("mouseenter", i);
                        e.on("mouseleave", j);
                        d.$on("$destroy", function() {
                            n.remove();
                        });
                    }
                };
            }
        };
    } ]);
})();