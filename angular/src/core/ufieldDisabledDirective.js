uf.directive("ufieldDisabled", function ($parse) {
    return {
        require: "?^uForm",
        restrict: 'A',
        link: function (scope, element, attr, form) {
            scope.$watch(function () {
                var res = $parse(attr['ufieldDisabled'])(form.result);
                return res;
            }, function (value) {
                element[0].disabled = value;
            })
        }
    }
})
