uf.directive('bindDirectiveCompile', ['$compile', function ($compile) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            var listener = scope.$watch(function () {
                return scope.$eval(attrs.bindDirectiveCompile);
            }, function (value) {
                value = '<div ' + value + ' />'
                element.html(value && value.toString());
                // If scope is provided use it, otherwise use parent scope
                var compileScope = scope;
                if (attrs.bindDirectiveScope) {
                    compileScope = scope.$eval(attrs.bindDirectiveScope);
                }
                $compile(element.contents())(compileScope);
                listener(); //you don't need to watch the directive once it is compiled
            });
        }
    };
}])
