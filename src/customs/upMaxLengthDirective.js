uf.directive("upMaxLength", function ($parse) {
    return {
        require: 'ngModel',
        restrict: 'A',
        link: function (scope, ele,attr, model) {
            model.$viewChangeListeners.push(function(){
                var value = model.$viewValue;
                value.length > attr['upMaxLength'] ? model.$setViewValue(value.substring(0,attr['upMaxLength'])) : null;
                model.$render();
            });
        }
    }
})
