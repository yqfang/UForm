;(function() {
    angular.module("up.uform")
    	.directive('mayaHttpSelect', function($http, $timeout) {
		return {
			restrict: 'EA',
			controller: function($scope) {
                var vm = this;
                angular.extend(vm, $scope.$custom);
				this.getLists = function(val){
					var url = vm.field.url ? vm.field.url : "https://api.github.com/search/repositories";
					var proName = vm.field.proName ? vm.field.proName : 'items';
					return $http.get("https://api.github.com/search/repositories",{params:{q: val}}).then(function(res){
						if(res.data && res.data[proName]) {
							return res.data[proName];
						} else {
							return null;
						}
					});
				};
			},
            controllerAs: 'vm',
			templateUrl: 'components/maya-http-select/main.html',
			link: function(scope, ele, attr) {}
		}
	})
})();
