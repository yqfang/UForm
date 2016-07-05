;(function() {
    angular.module("uForm")
    	.directive('mayaUiSelect', function() {
		return {
			restrict: 'EA',
			require: ['?^uForm', 'mayaUiSelect'],
			controller: function($scope) {
				var me = this;
				var $formtplScope = $scope.$parent;
				this.field = $formtplScope.$eval('field');
				this.result = [];
				this.addToResult = function(){
					me.form.result[me.field.name] = [];
					angular.forEach(me.result, function(item) {
						me.form.result[me.field.name].push(item.id);
					})
				}
			},
			scope: {},
			controllerAs: 'vm',
			templateUrl: 'templates/maya-ui-select.html',
			link: function(scope, elem, attr, ctrls) {
		    	var form = ctrls[0];
				var me = ctrls[1];
				me.form = form;
		    }
		}
	})
})();