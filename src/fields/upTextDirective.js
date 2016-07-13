uf.directive('upText', ['$compile', 'uFormUtil', function ($compile, uFormUtil) {
    return {
        restrict: 'EA',
        controller: ["$scope", function ($scope) {
            angular.extend(this, $scope.$proxy);
        }],
        controllerAs: 'vm',
        link: function (scope, elem, attr) {
            uFormUtil.getTemplate('up-text').then(function(textTpl) {
                elem.html(textTpl.replace(/ng-model/g, uFormUtil.toAttrs(scope.vm.field.customs) + "ng-model"));
                $compile(elem.contents())(scope);
            });
        }
    }
}])