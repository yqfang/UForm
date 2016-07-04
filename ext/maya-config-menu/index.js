;(function() {
    angular.module("uForm")
    	.directive('mayaConfigMenu', function($state, $timeout, dialogs) {
		return {
			restrict: 'EA',
			require: ['?^uForm', 'mayaConfigMenu'],
			controller: function($scope) {
				var $formtplScope = $scope.$parent;
				this.field = $formtplScope.$eval('field');
				this.result = [];
			},
			scope: {},
			controllerAs: 'vm',
			templateUrl: 'templates/maya-config-menu.html',
			link: function(scope, elem, attr, ctrls) {
                var self = ctrls[1],
                    form = ctrls[0];
                self.config = function (e) {
                    e.preventDefault();
                    dialogs.notify("点菜", "请点菜", {
                        size: "sm"
                    });
                }
                
		    }
		}
	})
})();