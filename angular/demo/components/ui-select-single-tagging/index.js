angular.module("up.uform")
    	.directive('mayaUiSelectSingleTagging', function($parse) {
		return {
			restrict: 'EA',
			controller: function($scope) {
                var vm = this;
                angular.extend(vm, $scope.$proxy);
                vm.newTag = function(newTag){
                    vm.form.result[vm.field.name] = newTag;
                    var obj = {};
                    obj.name = newTag;
                    obj.email = newTag + "@sysnew.com"
                    return obj;
                };
                vm.onSelect = function($select){
                    vm.form.result[vm.field.name] = $select.selected.name;
                }
			},
            controllerAs: 'vm',
			templateUrl: 'components/ui-select-single-tagging/main.html',
			link: function(scope, elem, attr) {

		    }
		}
	})
