
;(function() {
    angular.module("up.uform")
    	.directive('mayaConfigGroup', function($state, $timeout, dialogs) {
		return {
			restrict: 'EA',
			controller: function($scope) {
                var vm = this;
                angular.extend(vm, $scope.$proxy);
				this.clear = function(e) {
                    e.preventDefault();
                    $state.go($state.current, {}, {reload: true}).then(function(){
                        $timeout(function(){
                           dialogs.success("", "清空成功！")
                        }, 0)

                    })
                }
			},
            controllerAs: 'vm',
			templateUrl: 'components/maya-config-group/main.html',
			link: function(scope, elem, attr) {}
		}
	})
})();
