uf.directive("uForm", function ($rootScope, uFormUtil, $compile) {
    return {
        restrict: "EA",
        controller: function ($scope, $attrs, $rootScope) {
            var $parent = $scope.$parent;
            this.fields = $parent.$eval($attrs.fields);
            this.option = $parent.$eval($attrs.option);
            this.result = $parent.$eval($attrs.result) || $parent.$eval($attrs.result + "={}");
        },
        scope: {},
        controllerAs: "uform",
        require: '?^uFormGroup',
        link: function (scope, elem, attr, group) {
            uFormUtil.getTemplate('form').then(function(tpl) {
                elem.html(tpl.replace(/form_layout/i, scope.uform.option.layout || ""));
                $compile(elem.contents())(scope);
            })
            scope.uform.$form = scope.$parent.$eval(attr.name);
            group && group.fields && group.fields.push(scope.uform.fields);
            group && group.result && group.result.push(scope.uform.result);
        }

    }
});
