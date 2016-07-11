;(function() {
    angular.module("up.uform")
    	.directive('mayaUiSelect', function() {
		return {
			restrict: 'EA',
			controller: function($scope) {
                var vm = this;
                angular.extend(vm, $scope.$proxy);
				this.addToResult = function(){
					vm.form.result[vm.field.name] = [];
					angular.forEach(vm.result, function(item) {
						vm.form.result[vm.field.name].push(item.id);
					})
				}
			},
            controllerAs: 'vm',
			templateUrl: 'components/maya-ui-select/main.html',
			link: function(scope, elem, attr) {

		    }
		}
	})
})();
