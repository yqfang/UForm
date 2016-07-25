uf
    .directive('upFormActualLayout', function(uFormUtil, $compile) {
        return {
            restrict: 'EA',
            transclude: true,
            require: '?^uForm',
            link: function(scope, elem, attrs, form) {
                var colarr = form.option.layout;
                if(!colarr) return;
                var gap = 24 / colarr.length;
                var fieldLength = form.sfields.length;
                var ecol = '</div>'
                var templ = "";

                var z = 0;
                for(var i = 0; i < colarr.length; i++) {
                    var ttempl = '<div class="col-xs-' + gap + '">';
                    var strt = [];
                    colarr[i] || (colarr[i] = form.sfields.length / colarr.length);
                    if(i == colarr.length - 1) {
                        var tsum = 0;
                        for(var a = 0; a < colarr.length -1; a ++) {
                            tsum += colarr[a];
                        }
                        colarr[i] = form.sfields.length - tsum;
                    }
                    var tl = colarr[i];
                    for(var j = 0; (j < tl) && (z < form.sfields.length); j++) {
                        strt[j] = '<div transclude-id="' + form.option.name + '.' + form.sfields[z].name + '"></div>';
                        z++;
                    }
                    ttempl += strt.join('');
                    ttempl += ecol;
                    templ += ttempl;
                }
                //  uFormUtil.getTemplate(tpl).then(function(textTpl) {
                        elem.html(templ);
                        $compile(elem.contents())(scope);
                //  })
            }
        }
	})
