;(function() {
    angular.module("up.uform")
    	.directive('mayaHttpSelect', function($http, $timeout) {
		return {
			restrict: 'EA',
			require: '?^customField',
			controller: function($scope) {
				var me = this;
				this.getLists = function(val){
					var url = me.field.url ? me.field.url : "https://api.github.com/search/repositories";
					var proName = me.field.proName ? me.field.proName : 'items';
					return $http.get("https://api.github.com/search/repositories",{params:{q: val}}).then(function(res){
						if(res.data && res.data[proName]) {
							return res.data[proName];
						} else {
							return [];
						}
					});
				};
			},
			scope: {},
			controllerAs: 'vm',
			templateUrl: 'components/maya-http-select/main.html',
			link: function(scope, ele, attr, custom) {
				angular.extend(scope.vm, custom);
		    }
		}
	})
})();