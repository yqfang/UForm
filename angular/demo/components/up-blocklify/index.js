angular.module("up.uform")
    	.directive('upBlocklify', function($compile, $timeout) {
		return {
			restrict: 'A',
            controllerAs: 'vm',
            require: 'ngModel',
            link: function(scope, element, attrs, modelCtrl) {
                var subScope = scope.$new(true);
                $timeout(function() {
                    subScope.value = modelCtrl.$viewValue || modelCtrl.$modelValue;
                    element.after($compile('<span ng-bind="value"></span>')(subScope));
                    element.css('display', 'none');
                }, 0)
                
    
            }
		}
	})
