;(function() {
    angular.module("uForm")
    	.directive('mayaConfigGroup', function($state, $timeout, dialogs) {
		return {
			restrict: 'EA',
			require: ['?^uForm', 'mayaConfigGroup'],
			controller: function($scope) {
				var $formtplScope = $scope.$parent;
				this.field = $formtplScope.$eval('field');
				this.result = [];
			},
			scope: {},
			controllerAs: 'vm',
			templateUrl: 'templates/maya-config-group.html',
			link: function(scope, elem, attr, ctrls) {
                var form = ctrls[0],
                    self = ctrls[1];
                self.clear = function(e) {
                    e.preventDefault();
                    $state.go($state.current, {}, {reload: true}).then(function(){
                        $timeout(function(){
                           dialogs.success("", "清空成功！")
                        }, 0)
                        
                    })
                }
		    }
		}
	})
})();