;(function() {
    angular.module("up.uform")
    	.directive('mayaConfigMenu', function($state, $timeout, dialogs) {
		return {
			restrict: 'EA',
			controller: function($scope) {
                angular.extend(this, $scope.$proxy);
				this.config = function (e) {
                    e.preventDefault();
                    dialogs.notify("点菜", "请点菜", {
                        size: "sm"
                    });
                }
			},
            controllerAs: 'vm',
			templateUrl: 'components/maya-config-menu/main.html',
			link: function(scope, elem, attr) {}
		}
	})
})();
