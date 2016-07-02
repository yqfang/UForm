uf.directive("upFieldHide", function ($parse) {
    return {
        require: "?^uForm",
        restrict: 'A',
        link: function (scope, element, attr, uform) {
            var exp;
            if ('hide' in scope.field) {
                scope.$watch(function () {
                    var res = $parse(attr.upFieldHide)(uform.result);
                    return res;
                }, function (value) {
                    // hide the element
                    element.css('display', value ? 'none' : '');
                    // delete the hide element from resutl
                    if (value) { delete uform.result[scope.field.name]; }
                })
            }
        }
    }
})
