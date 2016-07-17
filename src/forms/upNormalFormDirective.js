uf.directive('upNormalForm', ['$compile', 'uFormUtil', function ($compile, uFormUtil) {
    return {
        restrict: 'EA',
        link: function (scope, elem, attr) {
            uFormUtil.getTemplate('up-normal-form').then(function(textTpl) {
                elem.html(textTpl.replace(/FORM_NAME/g, attr.name));
                $compile(elem.contents())(scope);
            });
        }
    }
}])
