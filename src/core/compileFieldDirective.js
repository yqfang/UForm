uf.directive('compileField', ['$compile', 'uFormUtil', function ($compile, uFormUtil) {
    return {
        restrict: 'A',
        controller: function($scope) {
            var vm = this;
            this.field = $scope.$parent.$eval('field');
            this.form = {};
        },
        require: '?^uForm',
        controllerAs: '$proxy',
        scope: {},
        link: function (scope, element, attrs, form) {
            angular.extend(scope.$proxy.form, form);
            var type = scope.$parent.$eval(attrs.compileField) || 'up-text';
            var formEle = element.closest("[u-form]");
            var targetName = scope.$proxy.field.name;
            var slot = formEle.find("[transclude-id='" + targetName + "']");
            uFormUtil.getTemplate('field').then(function(textTpl) {
                var actpl = textTpl.replace(/tmptype/i, type);
                if(slot.length){
                    slot.html(actpl);
                    $compile(slot.contents())(scope);
                }else {
                    element.html(actpl);
                    $compile(element.contents())(scope);
                }
            })
        }
    };
}])
