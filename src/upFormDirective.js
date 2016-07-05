uf.directive("uForm", function ($rootScope) {
    return {
        templateUrl: 'form.html',
        transclude: true,
        restrict: "EA",
        controller: function ($scope, $attrs, $rootScope, ufield) {
            var $parent = $scope.$parent;
            this.fields = $parent.$eval($attrs.fields);
            angular.forEach(this.fields, function(field) {
                angular.extend(field, ufield.create(field));
            })
            this.option = $parent.$eval($attrs.option);
            this.result = $parent.$eval($attrs.result) || $parent.$eval($attrs.result + "={}");
            this.ref = $scope;
        },
        scope: {},
        controllerAs: "uform",
        require: '?^uFormGroup',
        link: function (scope, elem, attr, group) {
            group && group.fields && group.fields.push(scope.uform.fields);
            group && group.result && group.result.push(scope.uform.result);
        }

    }
});
