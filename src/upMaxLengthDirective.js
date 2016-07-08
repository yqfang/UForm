uf.directive("upMaxLength", function ($parse) {
    return {
        require: ["?^uForm","?ngModel"],
        restrict: 'A',
        link: function (scope, ele,attr, ctrls) {
            var model = ctrls[1];
            var form = ctrls[0];
            model.$viewChangeListeners.push(function(){
                var value = model.$viewValue;
                value.length > attr['upMaxLength'] ? model.$setViewValue(value.substring(0,attr['upMaxLength'])) : null;
                model.$render();
            });
        }
    }
})
