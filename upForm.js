;(function() {
	var self = angular.module("uForm", ['ui.bootstrap']);
	self.directive("uForm", function() {
		return {
			templateUrl: 'form-templates/myForm.html', 			
			transclude: true,
			controller: function($scope, $attrs) {
				this.fields = $scope.$eval($attrs.fields);
				this.option = $scope.$eval($attrs.option);
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
		.directive(directiveSelector, function() {
		  return {
		  	restrict: 'EA',
		    controller: function($scope, $attrs) {
			    var directiveScope = $scope.$parent;
			    this.field = directiveScope.$eval($attrs.field);
			    this.ref = $scope;
			    this.init = function() {
					//init date with value: today  
			    	if(this.field.type === 'input:date') {
			    		this.ref.model = new Date();
			    	}
			    }
			    this.init(); 
			     		   
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