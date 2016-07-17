angular.module("up.uform")
    	.directive('mayaHttpSelect', function($http, $timeout) {
		return {
			restrict: 'EA',
			controller: function($scope) {
                var vm = this;
                angular.extend(vm, $scope.$proxy);
				this.getLists = function(val){
					var url = vm.field.url ? vm.field.url : "test.json";
					var proName = vm.field.proName ? vm.field.proName : 'items';
					return $http.get("test.json",{params:{q: val}}).then(function(res){
						if(res.data && res.data[proName]) {
							return res.data[proName];
						} else {
							return null;
						}
					},function(e){
						alert(e)
					});
				};
			},
            controllerAs: 'vm',
			templateUrl: 'components/maya-http-select/main.html',
			link: function(scope, ele, attr) {}
		}
	})
