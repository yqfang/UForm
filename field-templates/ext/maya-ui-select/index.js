;(function() {
    angular.module("uForm")
    	.directive('mayaUiSelect', function() {
		return {
			restrict: 'EA',
			require: ['?^uForm', 'mayaUiSelect'],
			controller: function($scope) {
				var $formtplScope = $scope.$parent;
				this.field = $formtplScope.$eval('field');
				this.result = [];
			},
			scope: {},
			controllerAs: 'vm',
			templateUrl: 'templates/maya-ui-select.html',
			link: function(scope, elem, attr, ctrls) {
		    	var form = ctrls[0];
				var me = ctrls[1];
				scope.$watch(function() {
					return me.result
                   
				}, function(newValue, oldValue) {
					if( newValue !== oldValue) {
						form.result[me.field.name] = [];
						angular.forEach(me.result, function(item) {
							form.result[me.field.name].push(item.id);
						})
					}	
				}, true)
		    }
		}
	})
})();