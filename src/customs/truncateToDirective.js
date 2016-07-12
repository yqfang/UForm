uf.directive("truncateTo", function ($parse) {
    return {
        require: 'ngModel',
        restrict: 'A',
        link: function (scope, ele, attrs, modelCtrl) {

            var truncateTo = function(inputValue) {
                var length = parseInt(attrs['truncateTo']);
                if (inputValue == undefined) inputValue = '';
                var truncate = inputValue.substring(0, length);
                if (truncate !== inputValue) {
                    modelCtrl.$setViewValue(truncate);
                    modelCtrl.$render();
                }
                return truncate;
            }
            modelCtrl.$parsers.push(truncateTo);
            truncateTo("");
        }
    }
})
