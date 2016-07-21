angular.module("up.uform")
    	.directive('upLayout', function($timeout) {
		return {
			restrict: 'EA',
            transclude: true,
			templateUrl: 'components/form-wrapper.html',
			link: function(scope, elem, attr, ctrl, transclude) {

		    }
		}
	})
