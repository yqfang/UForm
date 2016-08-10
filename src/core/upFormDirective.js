uf.directive("uForm", function () {
    return {
        restrict: "EA",
        controller: function ($scope, $attrs, $filter) {
            var $parent = $scope.$parent;
            this.fields = $parent.$eval($attrs.fields);
            this.sfields = $filter('orderById')(this.fields, 'id');
            this.option = $parent.$eval($attrs.option);
            this.result = $parent.$eval($attrs.result) || $parent.$eval($attrs.result + "={}");
        },
        scope: {},
        templateUrl: 'form.html',
        controllerAs: "uform",
        require: '?^uFormGroup',
        link: function (scope, elem, attr, group) {
            scope.uform.$form = scope.$parent.$eval(attr.name);
            group && group.fields && group.fields.push(scope.uform.fields);
            group && group.result && group.result.push(scope.uform.result);
        }

    }
});
