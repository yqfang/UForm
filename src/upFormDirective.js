uf.directive("uForm", function ($rootScope) {
    return {
        templateUrl: 'templates/form.html',
        transclude: true,
        restrict: "EA",
        controller: function ($scope, $attrs, $rootScope) {
            var $parent = $scope.$parent;
            this.fields = $parent.$eval($attrs.fields);
            this.option = $parent.$eval($attrs.option);
            this.result = $parent.$eval($attrs.result) || $parent.$eval($attrs.result + "={}");
            this.ref = $scope;
        },
        scope: {},
        controllerAs: "form",
        require: ['?^uFormGroup'],
        link: function (scope, elem, attr, ctrls) {
            var uFormGroup = ctrls[0];
            uFormGroup && uFormGroup.fields && uFormGroup.fields.push(scope.form.fields);
            uFormGroup && uFormGroup.result && uFormGroup.result.push(scope.form.result);
        }

    }
});
