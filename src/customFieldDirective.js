uf.directive('customField', ['$compile', function ($compile) {
    return {
        restrict: 'A',
        controller: function($scope) {
            var vm = this;
            this.field = $scope.$parent.$eval('field');
            this.form = {};
        },
        require: '?^uForm',
        controllerAs: '$custom',
        scope: {},
        link: function (scope, element, attrs, form) {
            angular.extend(scope.$custom.form, form);
            var listener = scope.$watch(function () {
                return scope.$parent.$eval(attrs.customField);
            }, function (value) {
                value = '<div ' + value + ' />';
                element.html(value && value.toString());
                var compileScope = scope;
                $compile(element.contents())(compileScope);
                listener(); //you don't need to watch the directive once it is compiled
            });
        }
    };
}])
