;(function() {
	var self = angular.module("uForm", ['ui.bootstrap','ng.shims.placeholder','ngLocale', 'dialogs.main', 'angularValidator']);
	self.config(function($provide) {
		$provide.decorator('ngModelDirective', function($delegate) {
			var ngModel = $delegate[0], controller = ngModel.controller;
			ngModel.controller = ['$scope', '$element', '$attrs', '$injector', function(scope, element, attrs, $injector) {
				var $interpolate = $injector.get('$interpolate');
				attrs.$set('name', $interpolate(attrs.name || '')(scope));
				$injector.invoke(controller, this, {
				'$scope': scope,
				'$element': element,
				'$attrs': attrs
				});
			}];
			return $delegate;
		});
		angular.forEach({'ng-form': 'ngFormDirective', 'form': 'formDirective'}, function(directive) {
			$provide.decorator(directive, function($delegate) {
			var form = $delegate[0], controller = form.controller;
			form.controller = ['$scope', '$element', '$attrs', '$injector', function(scope, element, attrs, $injector) {
				var $interpolate = $injector.get('$interpolate');
				attrs.$set('name', $interpolate(attrs.name || attrs.ngForm || '')(scope));
				$injector.invoke(controller, this, {
				'$scope': scope,
				'$element': element,
				'$attrs': attrs
				});
			}];
			return $delegate;
		});
		})
		
	});
	self.filter('orderById', function() {
		return function(items, field, reverse) {
			var filtered = [];
			angular.forEach(items, function(item, name) {
				item["name"] = name;
				filtered.push(item);
			});
			filtered.sort(function(a, b) {
				return (a[field] > b[field] ? 1 : -1);
			});
			if(reverse) filtered.reverse();
			return filtered;
		};
	});
	self.directive("uFormGroup", function() {
		return {
			controller: function($scope, $attrs) {
				this.fields = $scope.$parent.$eval($attrs.fields) || $scope.$parent.$eval($attrs.fields + "=[]");;
				this.result = $scope.$parent.$eval($attrs.result) || $scope.$parent.$eval($attrs.result + "=[]");;
			},
			scope: {},
			template: '<div ng-transclude></div>',
			controllerAs: "uFormGroup",
			transclude: true
		}
	});
	self.directive("uForm", function($rootScope) {
		return {
			templateUrl: './form-templates/myForm.html',
			transclude: true,
			restrict: "EA",
			controller: function($scope, $attrs, $rootScope) {
				var $parent = $scope.$parent;
				this.fields = $parent.$eval($attrs.fields);
				this.option = $parent.$eval($attrs.option);
				this.result = $parent.$eval($attrs.result) || $parent.$eval($attrs.result + "={}");
			},
			scope: {},
			controllerAs: "form",
			require: ['?^uFormGroup'],
			link: function(scope, elem, attr, ctrls) {
				var uFormGroup = ctrls[0];
				uFormGroup && uFormGroup.fields && uFormGroup.fields.push(scope.form.fields);
				uFormGroup && uFormGroup.result && uFormGroup.result.push(scope.form.result);
			}
			
		}
	});
	self.directive('bindDirectiveCompile', ['$compile', function ($compile) {
            return {
                restrict: 'A',
                link: function (scope, element, attrs) {
                    var listener = scope.$watch(function () {						
                        return scope.$eval(attrs.bindDirectiveCompile);
                    }, function (value) {
						value = '<div ' + value + ' />'
                        element.html(value && value.toString());
                        // If scope is provided use it, otherwise use parent scope
                        var compileScope = scope;
                        if (attrs.bindDirectiveScope) {
                            compileScope = scope.$eval(attrs.bindDirectiveScope);
                        }
                        $compile(element.contents())(compileScope);
						listener(); //you don't need to watch the directive once it is compiled
                    });
                }
            };
        }])
	angular.forEach({
		'input-text': 'appInputTextComponent',
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
		'textarea': 'appTextareaComponent'
	}, function(directiveSelector, tpl) {
		self
		.directive(directiveSelector, function() {
		  return {
		  	restrict: 'EA',
		    controller: function($scope, $attrs) {
			    var directiveScope = $scope.$parent;
			    this.field = directiveScope.$eval('field');
			    this.ref = $scope;		     		   
  			},
		    controllerAs: 'componentCtrl',
		    templateUrl : './field-templates/' + tpl + '.html',
		    scope: {"model": '='},
		    replace: true,
		    require: ['?^uForm'],
		    link: function(scope, elem, attr, ctrl) {
		    }
		  }
		})
	});
	



})();



