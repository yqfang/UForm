;(function() {
    angular.module("up.uform")
    	.directive('mayaUiSelect', function() {
		return {
			restrict: 'EA',
			require: '?^customField',
			controller: function($scope) {
				var me = this;
				this.addToResult = function(){
					me.form.result[me.field.name] = [];
					angular.forEach(me.result, function(item) {
						me.form.result[me.field.name].push(item.id);
					})
				}
			},
			scope: {},
			controllerAs: 'vm',
			templateUrl: 'components/maya-ui-select/main.html',
			link: function(scope, elem, attr, custom) {
				angular.extend(scope.vm, custom);
		    }
		}
	})
})();