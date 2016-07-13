angular.forEach({
    upDate: "up-date",
    upTime: "up-time",
    upDatetime: "up-datetime",
    upPassword: "up-password",
    upCheckbox: "up-checkbox",
    upRadio: "up-radio",
    upSubmit: "up-submit",
    upSelect: "up-select",
    upTextarea: "up-textarea",
}, function (tpl, direct) {
    uf.directive(direct, ['$compile', 'uFormUtil', function ($compile, uFormUtil) {
        return {
            restrict: 'EA',
            controller: ["$scope", function ($scope) {
                angular.extend(this, $scope.$proxy);
            }],
            controllerAs: 'vm',
            link: function (scope, elem, attr) {
                 uFormUtil.getTemplate(tpl).then(function(textTpl) {
                        elem.html(textTpl.replace(/ng-model/g, uFormUtil.toAttrs(scope.vm.field.customs) + "ng-model"));
                        $compile(elem.contents())(scope);
                    })
            }
        }
    }])
});



