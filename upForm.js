;(function() {
	var self = angular.module("uForm", ['ui.bootstrap','ng.shims.placeholder','ngLocale']);

	self.directive("uFormGroup", function() {
		return {
			controller: function($scope, $attrs) {
				this.fields = $scope.$eval($attrs.fields) || $scope.$eval($attrs.fields + "=[]");;
				this.result = $scope.$eval($attrs.result) || $scope.$eval($attrs.result + "=[]");;
			},
			template: '<div ng-transclude></div>',
			controllerAs: "uFormGroup",
			transclude: true
		}
	});
	self.directive("uForm", function() {
		return {
			templateUrl: 'form-templates/myForm.html', 			
			transclude: true,
			controller: function($scope, $attrs, $rootScope) {
				this.fields = $scope.$eval($attrs.fields);
				this.option = $scope.$eval($attrs.option);
				this.result = $scope.$eval($attrs.result) || $scope.$eval($attrs.result + "={}");
				$rootScope.monitor.result = this.result;
				this.btnHandler = function(field) {
					$scope.$eval($attrs.btnHandler, {field: field});
				}
			},
			controllerAs: "form",
			require: ['?^uFormGroup'],
			link: function(scope, elem, attr, ctrls) {
				var uFormGroup = ctrls[0];
				uFormGroup && uFormGroup.fields && uFormGroup.fields.push(scope.form.fields);
				uFormGroup && uFormGroup.result && uFormGroup.result.push(scope.form.result);
			}
			
		}
	});
	angular.forEach({
		'input-text': 'appInputTextComponent',
		'input-url': 'appInputUrlComponent',
		'input-email': 'appInputEmailComponent',
		'input-date': 'appInputDateComponent',
		'input-time': 'appInputTimeComponent',
		'input-datetime': 'appInputDatetimeComponent',
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
			    	if(this.field.type === 'input:date' 
			    	|| this.field.type === 'input:time'
			    	|| this.field.type === 'input:datetime') {
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
})();

