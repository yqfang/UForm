;(function() {
	var self = angular.module("uForm", ['ui.bootstrap','ng.shims.placeholder','ngLocale', 'dialogs.main', 'angularValidator']);
	self.config(function($provide) {
		$provide.decorator('ngModelDirective', function($delegate) {
			var ngModel = $delegate[0], controller = ngModel.controller;
			ngModel.controller = ['$scope', '$element', '$attrs', '$injector', function(scope, element, attrs, $injector) {
				var $interpolate = $injector.get('$interpolate');
				attrs.$set('name', $interpolate(attrs.name || '')(scope));
				attrs.$set('validator', $interpolate(attrs.validator || '')(scope));
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
			templateUrl: 'templates/myForm.html',
			transclude: true,
			restrict: "EA",
			controller: function($scope, $attrs, $rootScope) {
				var $parent = $scope.$parent;
				this.fields = $parent.$eval($attrs.fields);
				this.option = $parent.$eval($attrs.option);
				this.result = $parent.$eval($attrs.result) || $parent.$eval($attrs.result + "={}");
				this.ref = $scope;
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
	self.directive("upFieldHide", function() {
		return {
			require: "?^uForm",
			restrict: 'A',
			link: function(scope, element, attr, uform) {
				var uFormScope = uform.ref;
				var exp;
				if('hide' in scope.field) {
					scope.$watch(function() {
					if(attr.upFieldHide == 'true' || attr.upFieldHide == true)
					 	return true;
					var res =  uFormScope.$eval('form.' + attr.upFieldHide);
					return res;
				}, function(value) {
					// hide the element
					element.css('display', value ? 'none' : '');
					// delete the hide element from resutl
					if(value) {delete uform.result[scope.field.name];}
				})
				}
				
			}
		}
	})
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
		    templateUrl : 'templates/' + tpl + '.html',
		    scope: {"model": '='},
		    replace: true,
		    require: ['?^uForm'],
		    link: function(scope, elem, attr, ctrl) {
		    }
		  }
		})
	});
	



})();




;(function() {
    angular.module("uForm")
    	.directive('mayaConfigGroup', function($state, $timeout, dialogs) {
		return {
			restrict: 'EA',
			require: ['?^uForm', 'mayaConfigGroup'],
			controller: function($scope) {
				var $formtplScope = $scope.$parent;
				this.field = $formtplScope.$eval('field');
				this.result = [];
			},
			scope: {},
			controllerAs: 'vm',
			templateUrl: 'templates/maya-config-group.html',
			link: function(scope, elem, attr, ctrls) {
                var form = ctrls[0],
                    self = ctrls[1];
                self.clear = function(e) {
                    e.preventDefault();
                    $state.go($state.current, {}, {reload: true}).then(function(){
                        $timeout(function(){
                           dialogs.success("", "清空成功！")
                        }, 0)
                        
                    })
                }
		    }
		}
	})
})();
;(function() {
    angular.module("uForm")
    	.directive('mayaConfigMenu', function($state, $timeout, dialogs) {
		return {
			restrict: 'EA',
			require: ['?^uForm', 'mayaConfigMenu'],
			controller: function($scope) {
				var $formtplScope = $scope.$parent;
				this.field = $formtplScope.$eval('field');
				this.result = [];
			},
			scope: {},
			controllerAs: 'vm',
			templateUrl: 'templates/maya-config-menu.html',
			link: function(scope, elem, attr, ctrls) {
                var self = ctrls[1],
                    form = ctrls[0];
                self.config = function (e) {
                    e.preventDefault();
                    dialogs.notify("点菜", "请点菜", {
                        size: "sm"
                    });
                }
                
		    }
		}
	})
})();
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
(function(module) {
try {
  module = angular.module('uForm');
} catch (e) {
  module = angular.module('uForm', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('templates/myForm.html',
    '<div>\n' +
    '	<style type="text/css">\n' +
    '		.form-inline .inline-control {\n' +
    '			display: inline-block;\n' +
    '		}\n' +
    '		.form-inline .datepicker {\n' +
    '			width: 120px;\n' +
    '		}\n' +
    '		.form-inline input[type=\'text\'] {\n' +
    '			width: 120px;\n' +
    '		}\n' +
    '		.form-inline .form-group {\n' +
    '		    display: inline-block;\n' +
    '		    margin-bottom: 0;\n' +
    '		    vertical-align: middle;\n' +
    '		    margin-right: 10px;\n' +
    '		}\n' +
    '		.form-horizontal .control-label {\n' +
    '			text-align: right;\n' +
    '		}\n' +
    '		.control-datepicker {\n' +
    '			padding-left: 0;\n' +
    '		}\n' +
    '		.timepicker tr.text-center {\n' +
    '			display: none;\n' +
    '		}\n' +
    '	</style>\n' +
    '<div class="form-group" up-field-hide="{{field.hide}}" ng-class="field.name" ng-repeat="field in form.fields | orderById: \'id\'">\n' +
    '	<label for="{{field.name}}" ng-class="form.option.labelClass" class="control-label">\n' +
    '	  <span ng-show="field.required && field.label">*</span>\n' +
    '	  <span ng-if="field.type!=\'input:checkbox\'">{{ field.label }}</span>\n' +
    '	</label>\n' +
    '	<div ng-switch="field.type"  ng-class="form.option.inputClass">\n' +
    '	  <div ng-switch-when="input" app-input-text-component model="form.result[field.name]">\n' +
    '	  </div>\n' +
    '	  <div ng-switch-when="input:url" app-input-url-component model="form.result[field.name]">\n' +
    '	  </div>\n' +
    '	  <div ng-switch-when="input:email" app-input-email-component model="form.result[field.name]">\n' +
    '      </div>\n' +
    '      <div ng-switch-when="input:multiple" app-input-multiple-component model="form.result[field.name]">\n' +
    '      </div>\n' +
    '	  <div ng-switch-when="input:date" app-input-date-component model="form.result[field.name]">\n' +
    '	  </div>\n' +
    '	  <div ng-switch-when="input:time" app-input-time-component model="form.result[field.name]">\n' +
    '	  </div>\n' +
    '	  <div ng-switch-when="input:datetime" app-input-datetime-component model="form.result[field.name]">\n' +
    '	  </div>\n' +
    '	  <div ng-switch-when="input:password" app-input-password-component model="form.result[field.name]">\n' +
    '	  </div>\n' +
    '	  <div ng-switch-when="input:checkbox" app-input-checkbox-component model="form.result[field.name]">\n' +
    '	  </div>\n' +
    '	  <div ng-switch-when="input:radio" app-input-radio-component model="form.result[field.name]">\n' +
    '	  </div>\n' +
    '	  <div ng-switch-when="input:submit" app-input-submit-component model="form.result[field.name]">\n' +
    '	  </div>\n' +
    '	  <div ng-switch-when="textarea" app-textarea-component model="form.result[field.name]">\n' +
    '	  </div>\n' +
    '	  <div ng-switch-when="select" app-select-component model="form.result[field.name]">\n' +
    '	  </div>\n' +
    '	  <div ng-switch-when="button" app-button-component model="form.result[field.name]">\n' +
    '	  </div>\n' +
    '	  <div ng-switch-default bind-directive-compile="field.type">\n' +
    '	  </div>\n' +
    '	</div>\n' +
    '</div>\n' +
    '<div ng-transclude></div>\n' +
    '</div>\n' +
    '');
}]);
})();

(function(module) {
try {
  module = angular.module('uForm');
} catch (e) {
  module = angular.module('uForm', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('templates/input-checkbox.html',
    '<div class="checkbox">\n' +
    '	<label>\n' +
    '	  <input type="checkbox"\n' +
    '					name="{{componentCtrl.field.name}}"\n' +
    '	         ng-model="componentCtrl.ref.model"/>\n' +
    '	         {{ componentCtrl.field.label }}\n' +
    '	</label>\n' +
    '</div>\n' +
    '');
}]);
})();

(function(module) {
try {
  module = angular.module('uForm');
} catch (e) {
  module = angular.module('uForm', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('templates/input-date.html',
    '<div>\n' +
    '	<input type="text"\n' +
    '			name="{{componentCtrl.field.name}}"\n' +
    '		   class="form-control datepicker" \n' +
    '	       datepicker-popup="yyyy-MM-dd" \n' +
    '	       ng-model="componentCtrl.ref.model" \n' +
    '	       ng-init="componentCtrl.ref.open=false" \n' +
    '	       is-open="componentCtrl.ref.open"\n' +
    '		   ng-style="componentCtrl.field.style" \n' +
    '	       show-button-bar="false"\n' +
    '	       ng-click="componentCtrl.ref.open=!componentCtrl.ref.open"/>\n' +
    '</div>\n' +
    '\n' +
    '');
}]);
})();

(function(module) {
try {
  module = angular.module('uForm');
} catch (e) {
  module = angular.module('uForm', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('templates/input-datetime.html',
    '<div>\n' +
    '<div class="col-xs-6 control-datepicker">\n' +
    '	<input type="text" \n' +
    '			name="{{componentCtrl.field.name}}"\n' +
    '		   class="form-control datepicker" \n' +
    '	       datepicker-popup="yyyy-MM-dd" \n' +
    '	       ng-model="componentCtrl.ref.model" \n' +
    '	       ng-init="componentCtrl.ref.open=false" \n' +
    '	       is-open="componentCtrl.ref.open" \n' +
    '	       show-button-bar="false"\n' +
    '	       ng-click="componentCtrl.ref.open=!componentCtrl.ref.open"/>\n' +
    '</div>\n' +
    '\n' +
    '<div>\n' +
    '	<div class="timepicker" timepicker ng-model="componentCtrl.ref.model"></div>\n' +
    '</div>\n' +
    '</div>\n' +
    '\n' +
    '');
}]);
})();

(function(module) {
try {
  module = angular.module('uForm');
} catch (e) {
  module = angular.module('uForm', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('templates/input-email.html',
    '<input type="email"\n' +
    '        name="{{componentCtrl.field.name}}"\n' +
    '        id="{{componentCtrl.field.name}}"\n' +
    '         ng-model="componentCtrl.ref.model"\n' +
    '         ng-required="componentCtrl.field.required"\n' +
    '                ng-maxlength="{{componentCtrl.field.maxlength}}"\n' +
    '       ng-minlength="{{componentCtrl.field.minlength}}"\n' +
    '       required-message="\'{{componentCtrl.field.requireMsg}}\'"\n' +
    '        invalid-message="\'{{componentCtrl.field.invalidMsg}}\'"\n' +
    '       validate-on="{{componentCtrl.field.validateOn}}"\n' +
    '         class="form-control" />\n' +
    '');
}]);
})();

(function(module) {
try {
  module = angular.module('uForm');
} catch (e) {
  module = angular.module('uForm', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('templates/input-multiple.html',
    '<select ng-init="componentCtrl.ref.model=componentCtrl.field.candidates[0].value"        class="form-control"\n' +
    '        ng-model="componentCtrl.ref.model"\n' +
    '        name="{{componentCtrl.field.name}}"\n' +
    '        ng-options="option.value as option.name for option in componentCtrl.field.candidates"\n' +
    '        multiple \n' +
    '        ng-required="componentCtrl.field.required">\n' +
    '</select>\n' +
    '');
}]);
})();

(function(module) {
try {
  module = angular.module('uForm');
} catch (e) {
  module = angular.module('uForm', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('templates/input-password.html',
    '<input type="password"\n' +
    '        name="{{componentCtrl.field.name}}"\n' +
    '        id="{{componentCtrl.field.name}}"\n' +
    '         ng-model="componentCtrl.ref.model"\n' +
    '         ng-required="componentCtrl.field.required"\n' +
    '                ng-maxlength="{{componentCtrl.field.maxlength}}"\n' +
    '       ng-minlength="{{componentCtrl.field.minlength}}"\n' +
    '              required-message="\'{{componentCtrl.field.requireMsg}}\'"\n' +
    '       validate-on="{{componentCtrl.field.validateOn}}"\n' +
    '              validator = "{{componentCtrl.field.validator}}"\n' +
    '              invalid-message = "{{componentCtrl.field.validator}}"\n' +
    '         class="form-control" />\n' +
    '');
}]);
})();

(function(module) {
try {
  module = angular.module('uForm');
} catch (e) {
  module = angular.module('uForm', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('templates/input-radio.html',
    '<div>\n' +
    '	<div class="radio-inline" ng-repeat="candidate in componentCtrl.field.candidates">\n' +
    '		<label >\n' +
    '			<input type="radio"\n' +
    '			ng-init="componentCtrl.ref.model=componentCtrl.field.candidates[0].value"\n' +
    '	         ng-model="componentCtrl.ref.model"\n' +
    '	         name="{{componentCtrl.field.name}}"\n' +
    '	         value="{{candidate.value}}" \n' +
    '	         ng-required="componentCtrl.field.required"/>{{candidate.label}}\n' +
    '	    </label>\n' +
    '	</div>\n' +
    '</div>');
}]);
})();

(function(module) {
try {
  module = angular.module('uForm');
} catch (e) {
  module = angular.module('uForm', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('templates/input-submit.html',
    '<input class="btn btn-primary" type="submit" value="{{componentCtrl.field.value}}"/>');
}]);
})();

(function(module) {
try {
  module = angular.module('uForm');
} catch (e) {
  module = angular.module('uForm', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('templates/input-text.html',
    '<input type="text"\n' +
    '        id="{{componentCtrl.field.name}}"\n' +
    '        name="{{componentCtrl.field.name}}"\n' +
    '       ng-model="componentCtrl.ref.model"\n' +
    '       ng-required="componentCtrl.field.required"\n' +
    '       ng-maxlength="{{componentCtrl.field.maxlength}}"\n' +
    '       ng-minlength="{{componentCtrl.field.minlength}}"\n' +
    '       required-message="\'{{componentCtrl.field.requireMsg}}\'"\n' +
    '        invalid-message="\'{{componentCtrl.field.invalidMsg}}\'"\n' +
    '       validate-on="{{componentCtrl.field.validateOn}}"\n' +
    '              validator = "{{componentCtrl.field.validator}}"\n' +
    '              invalid-message = "{{componentCtrl.field.validator}}"\n' +
    '       class="form-control" \n' +
    '       ng-disabled="componentCtrl.field.disabled"\n' +
    '       ng-attr-placeholder="{{componentCtrl.field.placeholder}}" \n' +
    '       ng-style="componentCtrl.field.style"/>\n' +
    '');
}]);
})();

(function(module) {
try {
  module = angular.module('uForm');
} catch (e) {
  module = angular.module('uForm', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('templates/input-time.html',
    '<div>\n' +
    '<div class="timepicker" timepicker ng-model="componentCtrl.ref.model"></div>\n' +
    '</div>');
}]);
})();

(function(module) {
try {
  module = angular.module('uForm');
} catch (e) {
  module = angular.module('uForm', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('templates/select.html',
    '<select ng-init="componentCtrl.ref.model=componentCtrl.field.candidates[0].value"        class="form-control"\n' +
    '        ng-model="componentCtrl.ref.model"\n' +
    '        name="{{componentCtrl.field.name}}"\n' +
    '        ng-options="option.value as option.name for option in componentCtrl.field.candidates"\n' +
    '        ng-required="componentCtrl.field.required">\n' +
    '</select>\n' +
    '');
}]);
})();

(function(module) {
try {
  module = angular.module('uForm');
} catch (e) {
  module = angular.module('uForm', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('templates/textarea.html',
    '<textarea ng-model="componentCtrl.ref.model"\n' +
    '            name="{{componentCtrl.field.name}}"\n' +
    '            id="{{componentCtrl.field.name}}"\n' +
    '          ng-required="componentCtrl.field.required"\n' +
    '                 ng-maxlength="{{componentCtrl.field.maxlength}}"\n' +
    '       ng-minlength="{{componentCtrl.field.minlength}}"\n' +
    '       required-message="\'{{componentCtrl.field.requireMsg}}\'"\n' +
    '        invalid-message="\'{{componentCtrl.field.invalidMsg}}\'"\n' +
    '       validate-on="{{componentCtrl.field.validateOn}}"\n' +
    '          class="form-control">\n' +
    '</textarea>\n' +
    '');
}]);
})();

(function(module) {
try {
  module = angular.module('uForm');
} catch (e) {
  module = angular.module('uForm', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('templates/maya-config-menu.html',
    '<button class="btn btn-default" ng-click="vm.config($event)">{{vm.field.model.btnName}}</button>');
}]);
})();

(function(module) {
try {
  module = angular.module('uForm');
} catch (e) {
  module = angular.module('uForm', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('templates/maya-config-group.html',
    '<div style="inline-block" ng-style="vm.field.style">\n' +
    '    <button class="btn btn-primary" ng-click="vm.execute($event)">{{vm.field.model.btn1}}</button>\n' +
    '    <button class="btn btn-warning" ng-click="vm.save($event)">{{vm.field.model.btn2}}</button>\n' +
    '    <button class="btn btn-danger" ng-click="vm.clear($event)">{{vm.field.model.btn3}}</button>\n' +
    '</div> ');
}]);
})();

(function(module) {
try {
  module = angular.module('uForm');
} catch (e) {
  module = angular.module('uForm', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('templates/maya-ui-select.html',
    '<div ng-style="vm.field.style">\n' +
    '<ui-select multiple ng-disabled="vm.field.disabled" close-on-select="false" style="width:85%;display:inline-block" sortable="true" ng-model="vm.result" title="Choose a color">    \n' +
    '    <ui-select-match placeholder="Select colors...">{{$item.name}}: {{$item.id}}</ui-select-match>\n' +
    '        <ui-select-choices repeat="item in (vm.field.model | filter: $select.search)">\n' +
    '            <div ng-bind-html="item.name | highlight: $select.search"></div>\n' +
    '            <small>\n' +
    '                id: {{item.id}}\n' +
    '                name: <span ng-bind-html="\'\'+item.name | highlight: $select.search"></span>\n' +
    '            </small>\n' +
    '    </ui-select-choices>          \n' +
    '</ui-select>\n' +
    '    \n' +
    '<button type="button" ng-click="vm.result = undefined" class="btn btn-link" style="margin-top: -3px;display:inline-block;vertical-align:top;color: #000">\n' +
    '    <i class="glyphicon glyphicon-trash"></i>\n' +
    '</button>\n' +
    '</div>\n' +
    '\n' +
    '\n' +
    '\n' +
    '');
}]);
})();

!function(e){try{e=angular.module("uForm")}catch(t){e=angular.module("uForm",[])}e.run(["$templateCache",function(e){e.put("templates/myForm.html",'<div><style type="text/css">\n\t\t.form-inline .inline-control {\n\t\t\tdisplay: inline-block;\n\t\t}\n\t\t.form-inline .datepicker {\n\t\t\twidth: 120px;\n\t\t}\n\t\t.form-inline input[type=\'text\'] {\n\t\t\twidth: 120px;\n\t\t}\n\t\t.form-inline .form-group {\n\t\t    display: inline-block;\n\t\t    margin-bottom: 0;\n\t\t    vertical-align: middle;\n\t\t    margin-right: 10px;\n\t\t}\n\t\t.form-horizontal .control-label {\n\t\t\ttext-align: right;\n\t\t}\n\t\t.control-datepicker {\n\t\t\tpadding-left: 0;\n\t\t}\n\t\t.timepicker tr.text-center {\n\t\t\tdisplay: none;\n\t\t}\n\t</style><div class="form-group" up-field-hide="{{field.hide}}" ng-class="field.name" ng-repeat="field in form.fields | orderById: \'id\'"><label for="{{field.name}}" ng-class="form.option.labelClass" class="control-label"><span ng-show="field.required && field.label">*</span> <span ng-if="field.type!=\'input:checkbox\'">{{ field.label }}</span></label><div ng-switch="field.type" ng-class="form.option.inputClass"><div ng-switch-when="input" app-input-text-component="" model="form.result[field.name]"></div><div ng-switch-when="input:url" app-input-url-component="" model="form.result[field.name]"></div><div ng-switch-when="input:email" app-input-email-component="" model="form.result[field.name]"></div><div ng-switch-when="input:multiple" app-input-multiple-component="" model="form.result[field.name]"></div><div ng-switch-when="input:date" app-input-date-component="" model="form.result[field.name]"></div><div ng-switch-when="input:time" app-input-time-component="" model="form.result[field.name]"></div><div ng-switch-when="input:datetime" app-input-datetime-component="" model="form.result[field.name]"></div><div ng-switch-when="input:password" app-input-password-component="" model="form.result[field.name]"></div><div ng-switch-when="input:checkbox" app-input-checkbox-component="" model="form.result[field.name]"></div><div ng-switch-when="input:radio" app-input-radio-component="" model="form.result[field.name]"></div><div ng-switch-when="input:submit" app-input-submit-component="" model="form.result[field.name]"></div><div ng-switch-when="textarea" app-textarea-component="" model="form.result[field.name]"></div><div ng-switch-when="select" app-select-component="" model="form.result[field.name]"></div><div ng-switch-when="button" app-button-component="" model="form.result[field.name]"></div><div ng-switch-default="" bind-directive-compile="field.type"></div></div></div><div ng-transclude=""></div></div>')}])}(),function(e){try{e=angular.module("uForm")}catch(t){e=angular.module("uForm",[])}e.run(["$templateCache",function(e){e.put("templates/input-checkbox.html",'<div class="checkbox"><label><input type="checkbox" name="{{componentCtrl.field.name}}" ng-model="componentCtrl.ref.model"> {{ componentCtrl.field.label }}</label></div>')}])}(),function(e){try{e=angular.module("uForm")}catch(t){e=angular.module("uForm",[])}e.run(["$templateCache",function(e){e.put("templates/input-date.html",'<div><input type="text" name="{{componentCtrl.field.name}}" class="form-control datepicker" datepicker-popup="yyyy-MM-dd" ng-model="componentCtrl.ref.model" ng-init="componentCtrl.ref.open=false" is-open="componentCtrl.ref.open" ng-style="componentCtrl.field.style" show-button-bar="false" ng-click="componentCtrl.ref.open=!componentCtrl.ref.open"></div>')}])}(),function(e){try{e=angular.module("uForm")}catch(t){e=angular.module("uForm",[])}e.run(["$templateCache",function(e){e.put("templates/input-datetime.html",'<div><div class="col-xs-6 control-datepicker"><input type="text" name="{{componentCtrl.field.name}}" class="form-control datepicker" datepicker-popup="yyyy-MM-dd" ng-model="componentCtrl.ref.model" ng-init="componentCtrl.ref.open=false" is-open="componentCtrl.ref.open" show-button-bar="false" ng-click="componentCtrl.ref.open=!componentCtrl.ref.open"></div><div><div class="timepicker" timepicker="" ng-model="componentCtrl.ref.model"></div></div></div>')}])}(),function(e){try{e=angular.module("uForm")}catch(t){e=angular.module("uForm",[])}e.run(["$templateCache",function(e){e.put("templates/input-email.html",'<input type="email" name="{{componentCtrl.field.name}}" id="{{componentCtrl.field.name}}" ng-model="componentCtrl.ref.model" ng-required="componentCtrl.field.required" ng-maxlength="{{componentCtrl.field.maxlength}}" ng-minlength="{{componentCtrl.field.minlength}}" required-message="\'{{componentCtrl.field.requireMsg}}\'" invalid-message="\'{{componentCtrl.field.invalidMsg}}\'" validate-on="{{componentCtrl.field.validateOn}}" class="form-control">')}])}(),function(e){try{e=angular.module("uForm")}catch(t){e=angular.module("uForm",[])}e.run(["$templateCache",function(e){e.put("templates/input-multiple.html",'<select ng-init="componentCtrl.ref.model=componentCtrl.field.candidates[0].value" class="form-control" ng-model="componentCtrl.ref.model" name="{{componentCtrl.field.name}}" ng-options="option.value as option.name for option in componentCtrl.field.candidates" multiple="" ng-required="componentCtrl.field.required"></select>')}])}(),function(e){try{e=angular.module("uForm")}catch(t){e=angular.module("uForm",[])}e.run(["$templateCache",function(e){e.put("templates/input-password.html",'<input type="password" name="{{componentCtrl.field.name}}" id="{{componentCtrl.field.name}}" ng-model="componentCtrl.ref.model" ng-required="componentCtrl.field.required" ng-maxlength="{{componentCtrl.field.maxlength}}" ng-minlength="{{componentCtrl.field.minlength}}" required-message="\'{{componentCtrl.field.requireMsg}}\'" validate-on="{{componentCtrl.field.validateOn}}" validator="{{componentCtrl.field.validator}}" invalid-message="{{componentCtrl.field.validator}}" class="form-control">')}])}(),function(e){try{e=angular.module("uForm")}catch(t){e=angular.module("uForm",[])}e.run(["$templateCache",function(e){e.put("templates/input-radio.html",'<div><div class="radio-inline" ng-repeat="candidate in componentCtrl.field.candidates"><label><input type="radio" ng-init="componentCtrl.ref.model=componentCtrl.field.candidates[0].value" ng-model="componentCtrl.ref.model" name="{{componentCtrl.field.name}}" value="{{candidate.value}}" ng-required="componentCtrl.field.required">{{candidate.label}}</label></div></div>')}])}(),function(e){try{e=angular.module("uForm")}catch(t){e=angular.module("uForm",[])}e.run(["$templateCache",function(e){e.put("templates/input-submit.html",'<input class="btn btn-primary" type="submit" value="{{componentCtrl.field.value}}">')}])}(),function(e){try{e=angular.module("uForm")}catch(t){e=angular.module("uForm",[])}e.run(["$templateCache",function(e){e.put("templates/input-text.html",'<input type="text" id="{{componentCtrl.field.name}}" name="{{componentCtrl.field.name}}" ng-model="componentCtrl.ref.model" ng-required="componentCtrl.field.required" ng-maxlength="{{componentCtrl.field.maxlength}}" ng-minlength="{{componentCtrl.field.minlength}}" required-message="\'{{componentCtrl.field.requireMsg}}\'" invalid-message="\'{{componentCtrl.field.invalidMsg}}\'" validate-on="{{componentCtrl.field.validateOn}}" validator="{{componentCtrl.field.validator}}" class="form-control" ng-disabled="componentCtrl.field.disabled" ng-attr-placeholder="{{componentCtrl.field.placeholder}}" ng-style="componentCtrl.field.style">')}])}(),function(e){try{e=angular.module("uForm")}catch(t){e=angular.module("uForm",[])}e.run(["$templateCache",function(e){e.put("templates/input-time.html",'<div><div class="timepicker" timepicker="" ng-model="componentCtrl.ref.model"></div></div>')}])}(),function(e){try{e=angular.module("uForm")}catch(t){e=angular.module("uForm",[])}e.run(["$templateCache",function(e){e.put("templates/select.html",'<select ng-init="componentCtrl.ref.model=componentCtrl.field.candidates[0].value" class="form-control" ng-model="componentCtrl.ref.model" name="{{componentCtrl.field.name}}" ng-options="option.value as option.name for option in componentCtrl.field.candidates" ng-required="componentCtrl.field.required"></select>')}])}(),function(e){try{e=angular.module("uForm")}catch(t){e=angular.module("uForm",[])}e.run(["$templateCache",function(e){e.put("templates/textarea.html",'<textarea ng-model="componentCtrl.ref.model" name="{{componentCtrl.field.name}}" id="{{componentCtrl.field.name}}" ng-required="componentCtrl.field.required" ng-maxlength="{{componentCtrl.field.maxlength}}" ng-minlength="{{componentCtrl.field.minlength}}" required-message="\'{{componentCtrl.field.requireMsg}}\'" invalid-message="\'{{componentCtrl.field.invalidMsg}}\'" validate-on="{{componentCtrl.field.validateOn}}" class="form-control">\n</textarea>')}])}(),function(e){try{e=angular.module("uForm")}catch(t){e=angular.module("uForm",[])}e.run(["$templateCache",function(e){e.put("templates/maya-config-group.html",'<div style="inline-block" ng-style="vm.field.style"><button class="btn btn-primary" ng-click="vm.execute($event)">{{vm.field.model.btn1}}</button> <button class="btn btn-warning" ng-click="vm.save($event)">{{vm.field.model.btn2}}</button> <button class="btn btn-danger" ng-click="vm.clear($event)">{{vm.field.model.btn3}}</button></div>')}])}(),function(e){try{e=angular.module("uForm")}catch(t){e=angular.module("uForm",[])}e.run(["$templateCache",function(e){e.put("templates/maya-config-menu.html",'<button class="btn btn-default" ng-click="vm.config($event)">{{vm.field.model.btnName}}</button>')}])}(),function(e){try{e=angular.module("uForm")}catch(t){e=angular.module("uForm",[])}e.run(["$templateCache",function(e){e.put("templates/maya-ui-select.html",'<div ng-style="vm.field.style"><ui-select multiple="" ng-disabled="vm.field.disabled" close-on-select="false" style="width:85%;display:inline-block" sortable="true" ng-model="vm.result" title="Choose a color"><ui-select-match placeholder="Select colors...">{{$item.name}}: {{$item.id}}</ui-select-match><ui-select-choices repeat="item in (vm.field.model | filter: $select.search)"><div ng-bind-html="item.name | highlight: $select.search"></div><small>id: {{item.id}} name: <span ng-bind-html="\'\'+item.name | highlight: $select.search"></span></small></ui-select-choices></ui-select><button type="button" ng-click="vm.result = undefined" class="btn btn-link" style="margin-top: -3px;display:inline-block;vertical-align:top;color: #000"><i class="glyphicon glyphicon-trash"></i></button></div>')}])}();