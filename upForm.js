;(function() {
	var self = angular.module("uForm", ['ui.bootstrap']);
	self.directive("uForm", function() {
		return {
			templateUrl: '/form-templates/myForm.html', 			
			transclude: true,
			controller: function($scope, $attrs) {
				this.config = $scope.$eval($attrs.config);
				this.result = $scope.$eval($attrs.result) || $scope.$eval($attrs.result + "={}");
				this.btnHandler = function(field) {
					$scope.$eval($attrs.btnHandler, {field: field});
				}
			},
			controllerAs: "form"
		}
	})
	angular.forEach({
		'input-text': 'appInputTextComponent',
		'input-url': 'appInputUrlComponent',
		'input-email': 'appInputEmailComponent',
		'input-date': 'appInputDateComponent',
		'input-multiple': 'appInputMultipleComponent',
		'input-password': 'appInputPasswordComponent',
		'input-checkbox': 'appInputCheckboxComponent',
		'input-radio': 'appInputRadioComponent',
		'input-submit': 'appInputSubmitComponent',
		'select': 'appSelectComponent',
		'textarea': 'appTextareaComponent',
		'button': 'appButtonComponent'
	}, function(directiveSelector, tpl) {
		self
		.directive(directiveSelector, function($injector, $compile) {
		  return {
		  	restrict: 'EA',
		    controller: function($scope, $attrs) {
			    var directiveScope = $scope.$parent;
			    this.field = directiveScope.$eval($attrs.field);
			    this.ref = $scope;	    		   
  			},
		    controllerAs: 'componentCtrl',
		    templateUrl : './field-templates/' + tpl + '.html',
		    scope: {"model": '='},
		    replace: true,
		    require: ['?^uForm'],
		    link: function(scope, elem, attr, ctrls) {
		    	var form = ctrls[0];
		    	scope.componentCtrl.onClickHandler = function(e, field) {
			   		e.preventDefault();
			   		e.stopPropagation()
			   		form.btnHandler(field);
			   	}	
		    }
		  }
		})
	});
})()