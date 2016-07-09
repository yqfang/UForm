uf.factory('uFormUtil', function($templateCache, $q, $http, dialogs) {
    return {
        toAttrs: toAttrs,
        getTemplate: getTemplate
    }
    function toAttrs(obj) {
        if(!obj) {
            return "";
        }
        var str = "";
        for(var o in obj) {
            var next;
            if(!obj[o]) {
                next = o;
            }else {
                next = (o + '=' + obj[o])
            }
            str += (next + ' ')
        }
        return str;
    }
    function getTemplate (name) {
        var tpath = name + '.html';
        var tpl = $templateCache.get(tpath);
        if(tpl) {
            return $q.when(tpl);
        }else {
            return $http.get(tpath, {cache: true}).then(function(html) {
                $templateCache.put(tpath, html);
                return html.data;
            }, function(response) {
                dialogs.error("模板错误!", "通过：" + tpath + " 找不到模板");
            })
        }
    }
})
