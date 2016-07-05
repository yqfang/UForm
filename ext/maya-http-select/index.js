;(function() {
    angular.module("uForm")
    	.directive('mayaHttpSelect', function($http) {
		return {
			restrict: 'EA',
			require: ['?^uForm', 'mayaHttpSelect'],
			controller: function($scope) {
				var me = this;
				var $formtplScope = $scope.$parent;
				this.field = $formtplScope.$eval('field');
				this.result = null;
				// config: {url: 100,proName: 'items'}
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
				this.addToResult = function(value){
					// console.log(me)
					me.parentResult[me.field.name] = "" + (value ? value : me.result);
					$scope.$apply();
				};
			},
			scope: {},
			controllerAs: 'vm',
			templateUrl: 'templates/maya-http-select.html',
			link: function(scope, ele, attr, ctrls) {
		    	var form = ctrls[0];
		    	ctrls[1].parentResult = ctrls[0].result;
				var input = ele.find('.maya-http-select')[0];
				ele.find('.maya-http-select').bind("input",function(e,a){
					ctrls[1].addToResult(input.value)
				})
		    }
		}
	})
})();