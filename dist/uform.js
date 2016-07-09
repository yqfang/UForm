/*!
 * uform
 * https://github.com/yqfang/UForm#readme
 * yqfang,qianzhixiang
 * Version: 1.0.0 - 2016-07-09T15:14:13.564Z
 * License: ISC
 */


(function() { 
"use strict";
var uf = angular.module('up.uform', ['ui.bootstrap']);

uf.config(["$provide", "datepickerConfig", function ($provide, datepickerConfig) {
    datepickerConfig.showWeeks = false;
    $provide.decorator('ngModelDirective', ["$delegate", function ($delegate) {
        var ngModel = $delegate[0], controller = ngModel.controller;
        ngModel.controller = ['$scope', '$element', '$attrs', '$injector', function (scope, element, attrs, $injector) {
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
    }]);

    angular.forEach({ 'ng-form': 'ngFormDirective', 'form': 'formDirective' }, function (directive) {
        $provide.decorator(directive, ["$delegate", function ($delegate) {
            var form = $delegate[0], controller = form.controller;
            form.controller = ['$scope', '$element', '$attrs', '$injector', function (scope, element, attrs, $injector) {
                var $interpolate = $injector.get('$interpolate');
                attrs.$set('name', $interpolate(attrs.name || attrs.ngForm || '')(scope));
                attrs.$set('angular-validator', "");
                $injector.invoke(controller, this, {
                    '$scope': scope,
                    '$element': element,
                    '$attrs': attrs
                });
            }];
            return $delegate;
        }]);
    })
}]);




uf.directive('compileField', ['$compile', function ($compile) {
    return {
        restrict: 'A',
        controller: ["$scope", function($scope) {
            var vm = this;
            this.field = $scope.$parent.$eval('field');
            this.form = {};
        }],
        require: '?^uForm',
        controllerAs: '$proxy',
        scope: {},
        link: function (scope, element, attrs, form) {
            angular.extend(scope.$proxy.form, form);
            element.html('<div ' + scope.$parent.$eval(attrs.compileField) + ' />');
            $compile(element.contents())(scope);
        }
    };
}])

uf.directive("uForm", ["$rootScope", function ($rootScope) {
    return {
        templateUrl: 'form.html',
        transclude: true,
        restrict: "EA",
        controller: ["$scope", "$attrs", "$rootScope", "ufield", function ($scope, $attrs, $rootScope, ufield) {
            var $parent = $scope.$parent;
            this.fields = $parent.$eval($attrs.fields);
            angular.forEach(this.fields, function(field) {
                angular.extend(field, ufield.create(field));
            })
            this.option = $parent.$eval($attrs.option);
            this.result = $parent.$eval($attrs.result) || $parent.$eval($attrs.result + "={}");
        }],
        scope: {},
        controllerAs: "uform",
        require: '?^uFormGroup',
        link: function (scope, elem, attr, group) {
            scope.uform.$form = scope.$parent.$eval(attr.name);
            group && group.fields && group.fields.push(scope.uform.fields);
            group && group.result && group.result.push(scope.uform.result);
        }

    }
}]);

uf.directive("uFormGroup", function () {
    return {
        controller: ["$scope", "$attrs", function ($scope, $attrs) {
            this.fields = $scope.$parent.$eval($attrs.fields) || $scope.$parent.$eval($attrs.fields + "=[]");;
            this.result = $scope.$parent.$eval($attrs.result) || $scope.$parent.$eval($attrs.result + "=[]");;
        }],
        scope: {},
        template: '<div ng-transclude></div>',
        controllerAs: "uFormGroup",
        transclude: true
    }
});

uf
  .directive('capitalize', function() {
    return {
      require: 'ngModel',
      link: function(scope, element, attrs, modelCtrl) {
        var capitalize = function(inputValue) {
          if (inputValue == undefined) inputValue = '';
          var capitalized = inputValue.toUpperCase();
          if (capitalized !== inputValue) {
            modelCtrl.$setViewValue(capitalized);
            modelCtrl.$render();
          }
          return capitalized;
        }
        modelCtrl.$parsers.push(capitalize);
        capitalize(scope[attrs.ngModel]); // capitalize initial value
      }
    };
  });

uf.directive("upFieldHide", ["$parse", function ($parse) {
    return {
        require: "?^uForm",
        restrict: 'A',
        link: function (scope, element, attr, form) {
            var exp;
            if ('hide' in scope.field) {
                scope.$watch(function () {
                    var res = $parse(attr.upFieldHide)(form.result);
                    return res;
                }, function (value) {
                    // hide the element
                    element.css('display', value ? 'none' : '');
                    // delete the hide element from resutl
                    if (value) { delete form.result[scope.field.name]; }
                })
            }
        }
    }
}])

uf.directive("upMaxLength", ["$parse", function ($parse) {
    return {
        require: 'ngModel',
        restrict: 'A',
        link: function (scope, ele,attr, model) {
            model.$viewChangeListeners.push(function(){
                var value = model.$viewValue;
                value.length > attr['upMaxLength'] ? model.$setViewValue(value.substring(0,attr['upMaxLength'])) : null;
                model.$render();
            });
        }
    }
}])

angular.forEach({
    upText: "up-text",
    upDate: "up-date",
    upTime: "up-time",
    upDatetime: "up-datetime",
    upPassword: "up-password",
    upCheckbox: "up-checkbox",
    upRadio: "up-radio",
    upSubmit: "up-submit",
    upSelect: "up-select",
    upTextarea: "up-textarea",
}, function (tpl, direct) {
    uf.directive(direct, ['$compile', 'uFormUtil', function ($compile, uFormUtil) {
        return {
            restrict: 'EA',
            controller: ["$scope", function ($scope) {
                angular.extend(this, $scope.$proxy);
            }],
            controllerAs: 'vm',
            link: function (scope, elem, attr) {
                 uFormUtil.getTemplate(tpl).then(function(textTpl) {
                        elem.html(textTpl.replace(/ng-model/g, uFormUtil.toAttrs(scope.vm.field.customs) + "ng-model"));
                        $compile(elem.contents())(scope);
                    })
            }
        }
    }])
});




uf.provider('ufield', [function() {
    var _tp = 'up-text'; // type
    var _vo = 'dirty'; // validateOn
    var _pt = /^.*$/; // defaut pattern
    var _setOpts = function(opts){
        var _opts = {};
        opts = opts || {};
        _opts.type = (angular.isDefined(opts.type)) ? opts.type : _tp; // type
        _opts.validateOn = (angular.isDefined(opts.validateOn) && ((opts.validateOn === 'dirty') || (opts.validateOn === 'blur'))) ? opts.validateOn : _vo; // validate_on
        _opts.pattern = (angular.isDefined(opts.pattern)) ? opts.pattern : _pt;
        return _opts;
    }; // end _setOpts
    this.useType = function(val) {
        if(angular.isDefined(val))
        _tp = val;
    }
    this.useValidateOn = function(val) {
        if(angular.isDefined(val))
        _vo = val;
    }
    this.usePattern = function(val) {
        if(angular.isDefined(val))
        _pt = val;
    }
    this.$get = [function() {
        return {
            create : function (opts) {
                opts = _setOpts(opts);
                return opts;
            }
        }
    }]
}])

// 把对象变为数组，并按照 id 排序
uf.filter('orderById', function () {
    return function (items, field, reverse) {
        var filtered = [];
        angular.forEach(items, function (item, name) {
            item["name"] = name;
            filtered.push(item);
        });
        filtered.sort(function (a, b) {
            return (a[field] > b[field] ? 1 : -1);
        });
        if (reverse) filtered.reverse();
        return filtered;
    };
});

uf.factory('uFormUtil', ["$templateCache", "$q", "$http", "dialogs", function($templateCache, $q, $http, dialogs) {
    return {
        toAttrs: toAttrs,
        getTemplate: getTemplate
    }
    function toAttrs(obj) {
        if(!obj) {
            return "";
        }
        var str = "";
        for(var o in obj) {
            var next;
            if(!obj[o]) {
                next = o;
            }else {
                next = (o + '=' + obj[o])
            }
            str += (next + ' ')
        }
        return str;
    }
    function getTemplate (name) {
        var tpath = name + '.html';
        var tpl = $templateCache.get(tpath);
        if(tpl) {
            return $q.when(tpl);
        }else {
            return $http.get(tpath, {cache: true}).then(function(html) {
                $templateCache.put(tpath, html);
                return html.data;
            }, function(response) {
                dialogs.error("模板错误!", "通过：" + tpath + " 找不到模板");
            })
        }
    }
}])

uf.directive('angularValidator', ['$injector', '$parse',
    function ($injector, $parse) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs, fn) {
                // This is the DOM form element
                var DOMForm = angular.element(element)[0];
                // an array to store all the watches for form elements
                var watches = [];
                // This is the the scope form model
                // All validation states are contained here
                var form_name = DOMForm.attributes['name'].value;
                var scopeForm = $parse(form_name)(scope);
                // Set the default submitted state to false
                scopeForm.submitted = false;
                // Watch form length to add watches for new form elements
                scope.$watch(function () { return Object.keys(scopeForm).length; }, function () {
                    // Destroy all the watches
                    // This is cleaner than figuring out which items are already being watched and only un-watching those.
                    angular.forEach(watches, function (watch) { watch(); });
                    setupWatches(DOMForm);
                });
                // Intercept and handle submit events of the form
                element.on('submit', function (event) {
                    event.preventDefault();
                    scope.$apply(function () {
                        scopeForm.submitted = true;
                    });

                    // If the form is valid then call the function that is declared in the angular-validator-submit attribute on the form element
                    if (scopeForm.$valid) {
                        scope.$apply(function () {
                            scope.$eval(DOMForm.attributes["angular-validator-submit"].value);
                        });
                    }
                });
                scopeForm.reset = function () {
                    // Clear all the form values
                    for (var i = 0; i < DOMForm.length; i++) {
                        if (DOMForm[i].name) {
                            scopeForm[DOMForm[i].name].$setViewValue("");
                            scopeForm[DOMForm[i].name].$render();
                        }
                    }
                    scopeForm.submitted = false;
                    scopeForm.$setPristine();
                };
                // Setup watches on all form fields
                setupWatches(DOMForm);

                //check if there is invalid message service for the entire form; if yes, return the injected service; if no, return false;
                function hasFormInvalidMessage(formElement) {
                    if (formElement && 'invalid-message' in formElement.attributes) {
                        return $injector.get(formElement.attributes['invalid-message'].value);
                    } else {
                        return false;
                    }
                }
                // Iterate through the form fields and setup watches on each one
                function setupWatches(formElement) {
                    var formInvalidMessage = hasFormInvalidMessage(formElement);
                    for (var i = 0; i < formElement.length; i++) {
                        // This ensures we are only watching form fields
                        if (i in formElement) {
                            setupWatch(formElement[i], formInvalidMessage);
                        }
                    }
                }
                // Setup $watch on a single formfield
                function setupWatch(elementToWatch, formInvalidMessage) {
                    // If element is set to validate on blur then update the element on blur
                    if ("validate-on" in elementToWatch.attributes && elementToWatch.attributes["validate-on"].value === "blur") {
                        angular.element(elementToWatch).on('blur', function () {
                            updateValidationMessage(elementToWatch, formInvalidMessage);
                            updateValidationClass(elementToWatch);
                        });
                    }
                    var watch = scope.$watch(function () {
                        return elementToWatch.value + elementToWatch.required + scopeForm.submitted + checkElementValidity(elementToWatch) + getDirtyValue(scopeForm[elementToWatch.name]) + getValidValue(scopeForm[elementToWatch.name]);
                    },
                        function () {

                            if (scopeForm.submitted) {
                                updateValidationMessage(elementToWatch, formInvalidMessage);
                                updateValidationClass(elementToWatch);
                            }
                            else {
                                // Determine if the element in question is to be updated on blur
                                var isDirtyElement = "validate-on" in elementToWatch.attributes && elementToWatch.attributes["validate-on"].value === "dirty";

                                if (isDirtyElement) {
                                    updateValidationMessage(elementToWatch, formInvalidMessage);
                                    updateValidationClass(elementToWatch);
                                }
                                // This will get called in the case of resetting the form. This only gets called for elements that update on blur and submit.
                                else if (scopeForm[elementToWatch.name] && scopeForm[elementToWatch.name].$pristine) {
                                    updateValidationMessage(elementToWatch, formInvalidMessage);
                                    updateValidationClass(elementToWatch);
                                }
                            }

                        });

                    watches.push(watch);
                }
                // Returns the $dirty value of the element if it exists
                function getDirtyValue(element) {
                    if (element) {
                        if ("$dirty" in element) {
                            return element.$dirty;
                        }
                    }
                }
                function getValidValue(element) {
                    if (element) {
                        if ("$valid" in element) {
                            return element.$valid;
                        }
                    }
                }
                function checkElementValidity(element) {
                    // If element has a custom validation function
                    if ("validator" in element.attributes) {
                        // Call the custom validator function
                        var isElementValid;
                        if (!element.attributes.validator || element.attributes.validator.value === "") {
                            isElementValid = true;
                        }
                        else {
                            isElementValid = (scope.$eval(element.attributes.validator.value) == true);
                        }

                        if (scopeForm[element.name]) {
                            scopeForm[element.name].$setValidity("angularValidator", isElementValid);
                            return isElementValid;
                        }
                        else {
                            return true;
                        }

                    }
                }
                // Adds and removes an error message as a sibling element of the form field
                // depending on the validity of the form field and the submitted state of the form.
                // Will use default message if a custom message is not given
                function updateValidationMessage(element, formInvalidMessage) {

                    var defaultRequiredMessage = function () {
                        return "<i class='fa fa-times'></i> Required";
                    };
                    var defaultInvalidMessage = function () {
                        return "<i class='fa fa-times'></i> Invalid";
                    };

                    // Make sure the element is a form field and not a button for example
                    // Only form elements should have names.
                    if (!(element.name in scopeForm)) {
                        return;
                    }
                    var scopeElementModel = scopeForm[element.name];

                    // Remove all validation messages
                    var validationMessageElement = isValidationMessagePresent(element);
                    if (validationMessageElement) {
                        validationMessageElement.remove();
                    }
                    // Only add validation messages if the form field is $dirty or the form has been submitted
                    if (scopeElementModel.$dirty || (scope[element.form.name] && scope[element.form.name].submitted)) {

                        if (scopeElementModel.$error.required) {
                            // If there is a custom required message display it
                            if ("required-message" in element.attributes) {
                                angular.element(element).after(generateErrorMessage(element.attributes['required-message'].value));
                            }
                            // Display the default required message
                            else {
                                angular.element(element).after(generateErrorMessage(defaultRequiredMessage));
                            }
                        } else if (!scopeElementModel.$valid) {
                            // If there is a custom validation message add it
                            if ("invalid-message" in element.attributes) {
                                angular.element(element).after(generateErrorMessage(element.attributes['invalid-message'].value));
                            }
                            // Display error message provided by custom service
                            else if (formInvalidMessage) {
                                angular.element(element).after(generateErrorMessage(formInvalidMessage.message(scopeElementModel, element)));
                            }
                            // Display the default error message
                            else {
                                angular.element(element).after(generateErrorMessage(defaultInvalidMessage));
                            }
                        }
                    }
                }
                function generateErrorMessage(messageText) {
                    return "<label class='control-label has-error validationMessage'>" + scope.$eval(messageText) + "</label>";
                }
                // Returns the validation message element or False
                function isValidationMessagePresent(element) {
                    var elementSiblings = angular.element(element).parent().children();
                    for (var i = 0; i < elementSiblings.length; i++) {
                        if (angular.element(elementSiblings[i]).hasClass("validationMessage")) {
                            return angular.element(elementSiblings[i]);
                        }
                    }
                    return false;
                }
                // Adds and removes .has-error class to both the form element and the form element's parent
                // depending on the validity of the element and the submitted state of the form
                function updateValidationClass(element) {
                    // Make sure the element is a form field and not a button for example
                    // Only form fields should have names.
                    if (!(element.name in scopeForm)) {
                        return;
                    }
                    var formField = scopeForm[element.name];
                    // This is extra for users wishing to implement the .has-error class on the field itself
                    // instead of on the parent element. Note that Bootstrap requires the .has-error class to be on the parent element
                    angular.element(element).removeClass('has-error');
                    angular.element(element.parentNode).removeClass('has-error');
                    // Only add/remove validation classes if the field is $dirty or the form has been submitted
                    if (formField.$dirty || (scope[element.form.name] && scope[element.form.name].submitted)) {
                        if (formField.$invalid) {
                            angular.element(element.parentNode).addClass('has-error');
                            // This is extra for users wishing to implement the .has-error class on the field itself
                            // instead of on the parent element. Note that Bootstrap requires the .has-error class to be on the parent element
                            angular.element(element).addClass('has-error');
                        }
                    }
                }
            }
        };
    }]);

}());
angular.module('up.uform').run(['$templateCache', function($templateCache) {$templateCache.put('form.html','<div><style type=text/css>\n\t\t.form-inline .inline-control {\n\t\t\tdisplay: inline-block;\n\t\t}\n\t\t.form-inline .datepicker {\n\t\t\twidth: 120px;\n\t\t}\n\t\t.form-inline input[type=\'text\'] {\n\t\t\twidth: 120px;\n\t\t}\n\t\t.form-inline .form-group {\n\t\t    display: inline-block;\n\t\t    margin-bottom: 0;\n\t\t    vertical-align: middle;\n\t\t    margin-right: 10px;\n\t\t}\n\t\t.form-horizontal .control-label {\n\t\t\ttext-align: right;\n\t\t}\n\t\t.control-datepicker {\n\t\t\tpadding-left: 0;\n\t\t}\n\t\t.timepicker tr.text-center {\n\t\t\tdisplay: none;\n\t\t}\n\t</style><div class=form-group up-field-hide={{field.hide}} ng-class=field.name ng-repeat="field in (uform.fields | orderById: \'id\')"><label for={{field.name}} ng-class=uform.option.labelClass class=control-label><span ng-show="field.required && field.label">*</span> <span ng-if="field.type!=\'up-checkbox\'">{{ field.label }}</span></label><div compile-field=field.type ng-class=uform.option.inputClass></div></div><div ng-transclude=""></div></div>');
$templateCache.put('up-checkbox.html','<div class=checkbox><label><input type=checkbox name={{vm.field.name}} ng-model=vm.form.result[vm.field.name]> {{ vm.field.label }}</label></div>');
$templateCache.put('up-checklist.html','');
$templateCache.put('up-date.html','<div><input type=text name={{vm.field.name}} class="form-control datepicker" datepicker-popup=yyyy-MM-dd ng-model=vm.form.result[vm.field.name] ng-init="vm.form.open=false" is-open=vm.form.open ng-style=vm.field.style show-button-bar=false ng-click="vm.form.open=!vm.form.open"></div>');
$templateCache.put('up-datetime.html','<div><div class="col-xs-6 control-datepicker"><input type=text name={{vm.field.name}} class="form-control datepicker" datepicker-popup=yyyy-MM-dd ng-model=vm.form.result[vm.field.name] ng-init="vm.form.open=false" is-open=vm.form.open show-button-bar=false ng-click="vm.form.open=!vm.form.open"></div><div><div class=timepicker timepicker="" ng-model=vm.form.result[vm.field.name]></div></div></div>');
$templateCache.put('up-password.html','<input type=password id={{vm.field.name}} name={{vm.field.name}} ng-model=vm.form.result[vm.field.name] ng-required=vm.field.required required-message="\'{{vm.field.requiredMsg}}\'" ng-maxlength={{vm.field.maxlength}} ng-minlength={{vm.field.minlength}} ng-pattern=vm.field.pattern validate-on={{vm.field.validateOn}} validator={{vm.field.validator}} invalid-message={{vm.field.validator}} class=form-control ng-disabled=vm.field.disabled ng-attr-placeholder={{vm.field.placeholder}} ng-style=vm.field.style>');
$templateCache.put('up-radio.html','<div><div class=radio-inline ng-repeat="candidate in vm.field.candidates"><label><input type=radio ng-init="vm.form.result[vm.field.name]=vm.field.candidates[0].value" ng-model=vm.form.result[vm.field.name] name={{vm.field.name}} value={{candidate.value}} ng-required=vm.field.required>{{candidate.label}}</label></div></div>');
$templateCache.put('up-select.html','<select ng-init="vm.form.result[vm.field.name]=vm.field.candidates[0].value" class=form-control ng-model=vm.form.result[vm.field.name] name={{vm.field.name}} ng-options="option.value as option.name for option in vm.field.candidates" ng-required=vm.field.required></select>');
$templateCache.put('up-submit.html','<input class="btn btn-primary" type=submit value={{vm.field.value}}>');
$templateCache.put('up-text.html','<input type=text id={{vm.field.name}} name={{vm.field.name}} ng-model=vm.form.result[vm.field.name] ng-required=vm.field.required required-message="\'{{vm.field.requiredMsg}}\'" ng-maxlength={{vm.field.maxlength}} ng-minlength={{vm.field.minlength}} ng-pattern=vm.field.pattern validate-on={{vm.field.validateOn}} validator={{vm.field.validator}} invalid-message={{vm.field.validator}} class=form-control ng-disabled=vm.field.disabled ng-attr-placeholder={{vm.field.placeholder}} ng-style=vm.field.style>');
$templateCache.put('up-textarea.html','<textarea id={{vm.field.name}} name={{vm.field.name}} ng-model=vm.form.result[vm.field.name] ng-required=vm.field.required required-message="\'{{vm.field.requiredMsg}}\'" ng-maxlength={{vm.field.maxlength}} ng-minlength={{vm.field.minlength}} ng-pattern=vm.field.pattern validate-on={{vm.field.validateOn}} validator={{vm.field.validator}} invalid-message={{vm.field.validator}} class=form-control ng-disabled=vm.field.disabled ng-attr-placeholder={{vm.field.placeholder}} ng-style=vm.field.style>\n</textarea>');
$templateCache.put('up-time.html','<div><div class=timepicker timepicker="" ng-model=vm.form.result[vm.field.name]></div></div>');}]);