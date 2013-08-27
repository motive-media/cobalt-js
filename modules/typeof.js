var typeOf = (function (Object, RegExp) {
    // WTFPL License - http://en.wikipedia.org/wiki/WTFPL
    var toString = Object.prototype.toString,
        cache = (Object.create || Object)(null),
        matchClass = /\w+(?=])/;

    return function typeOf(Unknown) {
        var asString = typeof Unknown;
        return asString == 'object' ? (
            Unknown === null ? 'null' : (
                cache[asString = toString.call(Unknown)] || (
                    cache[asString] = matchClass.test(asString) && RegExp.lastMatch.toLowerCase()
                )
            )
        ) : asString;
    };
}(Object, RegExp));
