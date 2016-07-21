uf.directive("ufieldHide", function ($parse) {
    return {
        require: "?^uForm",
        restrict: 'A',
        link: function (scope, element, attr, form) {
            var exp;
            if ('hide' in scope.$proxy.field) {
                scope.$watch(function () {
                    var res = $parse(attr.ufieldHide)(form.result);
                    return res;
                }, function (value) {
                    // hide the element
                    element.css('display', value ? 'none' : '');
                    // delete the hide element from resutl
                    if (value) { delete form.result[scope.$proxy.field.name]; }
                })
            }
        }
    }
})
