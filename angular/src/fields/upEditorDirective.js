uf.directive('upEditor', ['$compile', 'uFormUtil', function ($compile, uFormUtil) {
    return {
        restrict: 'EA',
        controller: ["$scope", function ($scope) {
            var vm = this;
            var syntaxMap = {
                sql: "text/x-sql",
                javascript: "application/javascript",
                json: "application/json"
            }

            angular.extend(this, $scope.$proxy);
            vm.field.option = {};
            var mode = syntaxMap[vm.field.syntax];
            angular.extend(this.field.option, {
                lineNumbers: true,
                lineWrapping: true,
                mode: mode || "text/x-sql"
            });
        }],
        controllerAs: 'vm',
        link: function (scope, elem, attr) {
            uFormUtil.getTemplate('up-editor').then(function(textTpl) {
                elem.html(textTpl.replace(/ng-model/g, uFormUtil.toAttrs(scope.vm.field.extend) + "ng-model"));
                $compile(elem.contents())(scope);
            });
        }
    }
}])
