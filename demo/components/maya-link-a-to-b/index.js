;(function() {
    angular.module("up.uform")
  .directive('mayaLinkAToB', function() {
    return {
      require: 'ngModel',
      link: function(scope, element, attrs, modelCtrl) {
          var value;
            element.on('blur', function() {
                scope.$apply(function() {
                    value = modelCtrl.$modelValue || modelCtrl.$viewValue;
                    if(value && value == 'hello') {
                        scope.vm.form.fields["linkedB"].disabled = true;
                    }
                    else {
                        scope.vm.form.result["linkedB"] = 'hello' + value;
                    }
                });
            })
      }
    };
  });
})();
