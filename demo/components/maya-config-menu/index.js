;(function() {
    angular.module("up.uform")
    	.directive('mayaConfigMenu', function($state, $timeout, dialogs) {
		return {
			restrict: 'EA',
			require: '?^customField',
			controller: function($scope) {
				this.config = function (e) {
                    e.preventDefault();
                    dialogs.notify("点菜", "请点菜", {
                        size: "sm"
                    });
                }
			},
			scope: {},
			controllerAs: 'vm',
			templateUrl: 'components/maya-config-menu/main.html',
			link: function(scope, elem, attr, custom) {
				angular.extend(scope.vm, custom);
		    }
		}
	})
})();
