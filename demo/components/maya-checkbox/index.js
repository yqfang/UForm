;(function() {
    angular.module("up.uform")
    	.directive('mayaCheckbox', function($state, $timeout, dialogs) {
		return {
			restrict: 'EA',
			controller: function($scope) {
                var vm = this;
                vm.check = function(item){
                    item.checked = !item.checked;
                    $scope.$emit("$value_changed",{
                        item: item,
                        field: vm.field
                    })
                }
                var init = function (){
                    angular.extend(vm, $scope.$custom);
                    $scope.$emit("$value_changed",{
                        field: vm.field
                    })
                }
                init();
			},
            controllerAs: 'vm',
			templateUrl: 'components/maya-checkbox/main.html',
			link: function(scope, elem, attr) {

            }
		}
	})
})();
