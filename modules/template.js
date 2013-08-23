var template_cache = {};

function tpl(template, data) {
    var content = template_cache[template];

    if (!content) {
        content = "var s='';s+=\'" +
            template.replace(/[\r\t\n]/g, " ")
            .split("'").join("\\'")
            .split("\t").join("'")
            .replace(/\{\{#([\w]*)\}\}(.*)\{\{\/(\1)\}\}/ig, function (match, $1, $2) {
                return "\';var i=0,l=data." + $1 +
                    ".length,d=data." + $1 +
                    ";for(;i<l;i++){s+=\'" +
                    $2.replace(/\{\{(\.|this)\}\}/g, "'+d[i]+'")
                        .replace(/\{\{([\w]*)\}\}/g, "'+d[i].$1+'") +
                    "\'}s+=\'";
            })
            .replace(/\{\{(.+?)\}\}/g, "'+data.$1+'") +
            "';return s;";

        template_cache[template] = content;
    }

    return data ? new Function("data", content)(data) : new Function("data", content);
}
