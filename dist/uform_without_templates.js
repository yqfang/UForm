/*!
 * uform
 * https://github.com/yqfang/UForm#readme
 * Version: 1.0.0 - 2016-07-02T18:33:38.405Z
 * License: ISC
 */


(function() { 
"user strict";
var uf = angular.module('up.uform', ['ui.bootstrap', 'ng.shims.placeholder', 'ngLocale', 'ui.select'])


uf.config(["$provide", function ($provide) {
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
                    if (!("validate-on" in elementToWatch.attributes) || elementToWatch.attributes["validate-on"].value === "") {
                        elementToWatch.attributes["validate-on"] = {
                            value: 'dirty'
                        }
                    }
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
                            isElementValid = scope.$eval(element.attributes.validator.value += ' === true');
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

uf.directive('bindDirectiveCompile', ['$compile', function ($compile) {
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
    'input-date': 'appInputDateComponent',
    'input-time': 'appInputTimeComponent',
    'input-datetime': 'appInputDatetimeComponent',
    'input-password': 'appInputPasswordComponent',
    'input-checkbox': 'appInputCheckboxComponent',
    'input-radio': 'appInputRadioComponent',
    'input-submit': 'appInputSubmitComponent',
    'select': 'appSelectComponent',
    'textarea': 'appTextareaComponent'
}, function (directiveSelector, tpl) {
    uf.directive(directiveSelector, function () {
        return {
            restrict: 'EA',
            controller: ["$scope", "$attrs", function ($scope, $attrs) {
                var directiveScope = $scope.$parent;
                this.field = directiveScope.$eval('field');
                this.ref = $scope;
            }],
            controllerAs: 'componentCtrl',
            templateUrl: tpl + '.html',
            scope: { "model": '=' },
            replace: true,
            require: ['?^uForm'],
            link: function (scope, elem, attr, ctrl) {
            }
        }
    })
});




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

uf.directive("upFieldHide", ["$parse", function ($parse) {
    return {
        require: "?^uForm",
        restrict: 'A',
        link: function (scope, element, attr, uform) {
            var exp;
            if ('hide' in scope.field) {
                scope.$watch(function () {
                    var res = $parse(attr.upFieldHide)(uform.result);
                    return res;
                }, function (value) {
                    // hide the element
                    element.css('display', value ? 'none' : '');
                    // delete the hide element from resutl
                    if (value) { delete uform.result[scope.field.name]; }
                })
            }
        }
    }
}])

uf.directive("uForm", ["$rootScope", function ($rootScope) {
    return {
        templateUrl: 'form.html',
        transclude: true,
        restrict: "EA",
        controller: ["$scope", "$attrs", "$rootScope", function ($scope, $attrs, $rootScope) {
            var $parent = $scope.$parent;
            this.fields = $parent.$eval($attrs.fields);
            this.option = $parent.$eval($attrs.option);
            this.result = $parent.$eval($attrs.result) || $parent.$eval($attrs.result + "={}");
            this.ref = $scope;
        }],
        scope: {},
        controllerAs: "form",
        require: ['?^uFormGroup'],
        link: function (scope, elem, attr, ctrls) {
            var uFormGroup = ctrls[0];
            uFormGroup && uFormGroup.fields && uFormGroup.fields.push(scope.form.fields);
            uFormGroup && uFormGroup.result && uFormGroup.result.push(scope.form.result);
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

}());