uf.directive('upBindCompile', ['$compile', function ($compile) {
    return {
        restrict: 'EA',
        link: function (scope, elem, attr) {
            var value = scope.$eval(attr.upBindCompile);
            elem.html(value && value.toString());
            $compile(elem.contents())(scope);
        }
    }
}])
