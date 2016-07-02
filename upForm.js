;(function() {
	angular.module('angularValidator', []);
	angular.module('angularValidator').directive('angularValidator', ['$injector', '$parse',
		function($injector, $parse) {
			return {
				restrict: 'A',
				link: function(scope, element, attrs, fn) {
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
					scope.$watch(function(){return Object.keys(scopeForm).length;}, function(){
						// Destroy all the watches
						// This is cleaner than figuring out which items are already being watched and only un-watching those.
						angular.forEach(watches, function(watch){watch();});
						setupWatches(DOMForm);
					});
				

					// Intercept and handle submit events of the form
					element.on('submit', function(event) {
						event.preventDefault();
						scope.$apply(function() {
							scopeForm.submitted = true;
						});

						// If the form is valid then call the function that is declared in the angular-validator-submit attribute on the form element
						if (scopeForm.$valid) {
							scope.$apply(function() {
								scope.$eval(DOMForm.attributes["angular-validator-submit"].value);
							});
						}
					});
					scopeForm.reset = function(){
						// Clear all the form values
						for (var i = 0; i < DOMForm.length; i++) {
							if (DOMForm[i].name){
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


						if (! ("validate-on" in elementToWatch.attributes) || elementToWatch.attributes["validate-on"].value === "") {
							elementToWatch.attributes["validate-on"] = {
								value: 'dirty'
							}
						}
						// If element is set to validate on blur then update the element on blur
						if ("validate-on" in elementToWatch.attributes && elementToWatch.attributes["validate-on"].value === "blur") {
							angular.element(elementToWatch).on('blur', function() {
								updateValidationMessage(elementToWatch, formInvalidMessage);
								updateValidationClass(elementToWatch);
							});
						}
						var watch = scope.$watch(function() {
								return elementToWatch.value + elementToWatch.required + scopeForm.submitted + checkElementValidity(elementToWatch) + getDirtyValue(scopeForm[elementToWatch.name]) + getValidValue(scopeForm[elementToWatch.name]);
							},
							function() {
							
								if (scopeForm.submitted){
									updateValidationMessage(elementToWatch, formInvalidMessage);
									updateValidationClass(elementToWatch);
								}
								else {
									// Determine if the element in question is to be updated on blur
									var isDirtyElement = "validate-on" in elementToWatch.attributes && elementToWatch.attributes["validate-on"].value === "dirty";

									if (isDirtyElement){
										updateValidationMessage(elementToWatch, formInvalidMessage);
										updateValidationClass(elementToWatch);
									}
									// This will get called in the case of resetting the form. This only gets called for elements that update on blur and submit.
									else if (scopeForm[elementToWatch.name] && scopeForm[elementToWatch.name].$pristine){
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
							if(!element.attributes.validator || element.attributes.validator.value === "") {
								isElementValid = true;
							}
							else {
								isElementValid = scope.$eval(element.attributes.validator.value += ' === true');
							}
							
							if(scopeForm[element.name]) {
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

						var defaultRequiredMessage = function() {
							return "<i class='fa fa-times'></i> Required";
						};
						var defaultInvalidMessage = function() {
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
		}]
	);
	angular.module('ng.shims.placeholder', [])
	.service('placeholderSniffer', ['$document', function($document){
		this.emptyClassName = 'empty',
		this.hasPlaceholder = function() {
			// test for native placeholder support
			var test = $document[0].createElement('input');
			return (test.placeholder !== void 0);
		};
	}])
	.directive('placeholder', ['$timeout', '$document', '$interpolate', '$injector', 'placeholderSniffer', function($timeout, $document, $interpolate, $injector, placeholderSniffer) {
		if (placeholderSniffer.hasPlaceholder()) return {};

		var documentListenersApplied = false,
			angularVersion = parseFloat(angular.version.full);

		// load $animate if available, to coordinate with other directives that use it
		try {
			var $animate = $injector.get('$animate');
		} catch (e) {}

		// No native support for attribute placeholder
		return {
			restrict: 'A',
			require: '?ngModel',
			// run after ngModel (0) and BOOLEAN_ATTR (100) directives.
			// priority order was reversed in Angular 1.2, so we must account for this
			priority: (angularVersion >= 1.2) ? 110 : -10,
			link: function(scope, elem, attrs, ngModel) {
				var orig_val = getValue(),
					domElem = elem[0],
					elemType = domElem.nodeName.toLowerCase(),
					isInput = elemType === 'input' || elemType === 'textarea',
					is_pwd = attrs.type === 'password',
					text = attrs.placeholder || '',
					emptyClassName = placeholderSniffer.emptyClassName,
					hiddenClassName = 'ng-hide',
					clone;

				if (!isInput) { return; }

				attrs.$observe('placeholder', function (newValue) {
					changePlaceholder(newValue);
				});

				if (is_pwd) { setupPasswordPlaceholder(); }

				// init
				setValue(orig_val);

				// on focus, replace auto-label with empty field
				elem.bind('focus', function() {
					if (elem.hasClass(emptyClassName)) {
						elem.val('');
						elem.removeClass(emptyClassName);
						domElem.select(); // IE8/9 show text cursor after tabbing in
					}
				});

				// on blur, show placeholder if necessary
				elem.bind('blur', updateValue);

				// handler for model-less inputs to interact with non-angular code
				if (!ngModel) {
					elem.bind('change', function (event) {
						changePlaceholder($interpolate(elem.attr('placeholder') || '')(scope), event);
					});
				}

				// model -> view
				if (ngModel) {
					ngModel.$render = function() {
						setValue(ngModel.$viewValue);
						// IE8/9: show text cursor after updating value while
						// focused, this happens when tabbing into a field, and the
						// deferred keydown handler from the previous field fires
						//
						// TODO: remove when tab key behavior is fixed in
						// angular core
						if (isActiveElement(domElem) && !elem.val()) {
							domElem.select();
						}
					};
				}

				if (!documentListenersApplied) {
					// cancel selection of placeholder text on disabled elements
					// disabled elements do not emit selectstart events in IE8/IE9,
					// so bind to $document and catch the event as it bubbles
					$document.bind('selectstart', function (e) {
						var elmn = angular.element(e.target);
						if (elmn.hasClass(emptyClassName) && elmn.prop('disabled')) {
							e.preventDefault();
						}
					});
					documentListenersApplied = true;
				}

				function updateValue(event) {
					var val = elem.val();

					// don't update from placeholder, helps debounce
					if (elem.hasClass(emptyClassName) && val && val === text) { return; }

					conditionalDefer(function(){ setValue(val); }, event);
				}

				function conditionalDefer(callback, event) {
					// IE8/9: ngModel uses a keydown handler with deferrered
					// execution to check for changes to the input. this $timeout 
					// prevents callback from firing before the keydown handler,
					// which is an issue when tabbing out of an input.
					// the conditional tests IE version, matches $sniffer.
					//
					// TODO: remove this function when tab key behavior is fixed in
					// angular core
					if (document.documentMode <= 11 && event) {
						$timeout(callback, 0);
					} else {
						callback();
					}
				}

				function setValue(val) {
					if (!val && val !== 0 && !isActiveElement(domElem)) {
						// show placeholder when necessary
						elem.addClass(emptyClassName);
						elem.val(!is_pwd ? text : '');
					} else {
						// otherwise set input to actual value
						elem.removeClass(emptyClassName);
						elem.val(val);
					}
					if (is_pwd) {
						updatePasswordPlaceholder();
						if ($animate) {
							asyncUpdatePasswordPlaceholder();
						}
					}
				}

				function getValue() {
					if (ngModel) {
						// use eval because $viewValue isn't ready during init
						// TODO: this might not to work during unit tests, investigate
						return scope.$eval(attrs.ngModel) || '';
					}
					return getDomValue() || '';
				}

				// IE8/9: elem.val() on an empty field sometimes returns the
				// placeholder value, so return an empty string instead
				// http://stackoverflow.com/q/11208417/490592
				// I believe IE is persisting the field value across refreshes
				// TODO: vs `elem.attr('value')`
				function getDomValue() {
					var val = elem.val();
					if (val === attrs.placeholder) {
						val = '';
					}
					return val;
				}

				function changePlaceholder(value, event) {
					if (elem.hasClass(emptyClassName) && elem.val() === text) {
						elem.val('');
					}
					text = value;
					updateValue(event);
				}

				// IE9: getting activeElement in an iframe raises error
				// http://tjvantoll.com/2013/08/30/bugs-with-document-activeelement-in-internet-explorer/
				function isActiveElement(elmn) {
					var result = false;
					try {
						result = elmn === document.activeElement;
					} catch (error) {}
					return result;
				}

				function setAttrConditional(elmn, attr, enable, value) {
					if (enable) {
						elmn.attr(attr, value);
					} else {
						elmn.removeAttr(attr);
					}
				}

				// IE8: password inputs cannot display text, and inputs cannot
				// change type, so create a new element to display placeholder
				function setupPasswordPlaceholder() {
					clone = angular.element('<input type="text" value="'+text+'"/>');
					stylePasswordPlaceholder();
					hideElement(clone);
					clone.addClass(emptyClassName)
						.bind('focus', hidePasswordPlaceholderAndFocus);
					domElem.parentNode.insertBefore(clone[0], domElem);

					// keep password placeholder in sync with original element.
					// update element after $watches
					var watchAttrs = [
						attrs.ngDisabled,
						attrs.ngReadonly,
						attrs.ngRequired,
						attrs.ngShow,
						attrs.ngHide
					];
					for (var i = 0; i < watchAttrs.length; i++) {
						if (watchAttrs[i]) {
							scope.$watch(watchAttrs[i], flexibleUpdatePasswordPlaceholder);
						}
					}
				}

				function updatePasswordPlaceholder() {
					stylePasswordPlaceholder();
					if (isNgHidden()) {
						// force hide the placeholder when element is hidden by
						// ngShow/ngHide. we cannot rely on stylePasswordPlaceholder
						// above to copy the ng-hide class, because the ngShow/ngHide
						// $watch functions apply the ng-hide class with $animate, 
						// so the class is not applied when our $watch executes
						hideElement(clone);
					} else if (elem.hasClass(emptyClassName) && domElem !== document.activeElement) {
						showPasswordPlaceholder();
					} else {
						hidePasswordPlaceholder();
					}
				}
				// update element after animation and animation-aware directives
				function asyncUpdatePasswordPlaceholder() {
					if (angularVersion >= 1.3) {
						$animate.addClass(elem, '').then(updatePasswordPlaceholder);
					} else {
						$animate.addClass(elem, '', updatePasswordPlaceholder);
					}
				}
				function flexibleUpdatePasswordPlaceholder() {
					if ($animate) {
						asyncUpdatePasswordPlaceholder();
					} else {
						updatePasswordPlaceholder();
					}
				}

				function stylePasswordPlaceholder() {
					clone.val(text);
					// chaining was failing in v1.0.8
					clone.attr('class', elem.attr('class') || '')
						.attr('style', elem.attr('style') || '')
						.prop('disabled', elem.prop('disabled'))
						.prop('readOnly', elem.prop('readOnly'))
						.prop('required', elem.prop('required'));
					setAttrConditional(clone, 'unselectable', elem.attr('unselectable') === 'on', 'on');
					setAttrConditional(clone, 'tabindex', elem.attr('tabindex') !== undefined, elem.attr('tabindex'));
				}

				function showElement(elmn) {
					if (angularVersion >= 1.2) {
						elmn.removeClass(hiddenClassName);
					} else {
						elmn.css('display', '');
					}
				}

				function hideElement(elmn) {
					if (angularVersion >= 1.2) {
						elmn.addClass(hiddenClassName);
					} else {
						elmn.css('display', 'none');
					}
				}

				function showPasswordPlaceholder() {
					hideElement(elem);
					showElement(clone);
				}

				function hidePasswordPlaceholder() {
					hideElement(clone);
					showElement(elem);
				}

				function hidePasswordPlaceholderAndFocus() {
					hidePasswordPlaceholder();
					domElem.focus();
				}

				function isNgHidden() {
					var hasNgShow = typeof attrs.ngShow !== 'undefined',
						hasNgHide = typeof attrs.ngHide !== 'undefined';
					if (hasNgShow || hasNgHide) {
						return (hasNgShow && !scope.$eval(attrs.ngShow)) ||
							(hasNgHide && scope.$eval(attrs.ngHide));
					} else {
						return false;
					}
				}

			}
		};
	}]);
	angular.module("ngLocale", [], ["$provide", function($provide) {
		var PLURAL_CATEGORY = {ZERO: "zero", ONE: "one", TWO: "two", FEW: "few", MANY: "many", OTHER: "other"};
		$provide.value("$locale", {
		"DATETIME_FORMATS": {
			"AMPMS": [
			"\u4e0a\u5348",
			"\u4e0b\u5348"
			],
			"DAY": [
			"\u661f\u671f\u65e5",
			"\u661f\u671f\u4e00",
			"\u661f\u671f\u4e8c",
			"\u661f\u671f\u4e09",
			"\u661f\u671f\u56db",
			"\u661f\u671f\u4e94",
			"\u661f\u671f\u516d"
			],
			"ERANAMES": [
			"\u516c\u5143\u524d",
			"\u516c\u5143"
			],
			"ERAS": [
			"\u516c\u5143\u524d",
			"\u516c\u5143"
			],
			"FIRSTDAYOFWEEK": 6,
			"MONTH": [
			"\u4e00\u6708",
			"\u4e8c\u6708",
			"\u4e09\u6708",
			"\u56db\u6708",
			"\u4e94\u6708",
			"\u516d\u6708",
			"\u4e03\u6708",
			"\u516b\u6708",
			"\u4e5d\u6708",
			"\u5341\u6708",
			"\u5341\u4e00\u6708",
			"\u5341\u4e8c\u6708"
			],
			"SHORTDAY": [
			"\u5468\u65e5",
			"\u5468\u4e00",
			"\u5468\u4e8c",
			"\u5468\u4e09",
			"\u5468\u56db",
			"\u5468\u4e94",
			"\u5468\u516d"
			],
			"SHORTMONTH": [
			"1\u6708",
			"2\u6708",
			"3\u6708",
			"4\u6708",
			"5\u6708",
			"6\u6708",
			"7\u6708",
			"8\u6708",
			"9\u6708",
			"10\u6708",
			"11\u6708",
			"12\u6708"
			],
			"STANDALONEMONTH": [
			"\u4e00\u6708",
			"\u4e8c\u6708",
			"\u4e09\u6708",
			"\u56db\u6708",
			"\u4e94\u6708",
			"\u516d\u6708",
			"\u4e03\u6708",
			"\u516b\u6708",
			"\u4e5d\u6708",
			"\u5341\u6708",
			"\u5341\u4e00\u6708",
			"\u5341\u4e8c\u6708"
			],
			"WEEKENDRANGE": [
			5,
			6
			],
			"fullDate": "y\u5e74M\u6708d\u65e5EEEE",
			"longDate": "y\u5e74M\u6708d\u65e5",
			"medium": "y\u5e74M\u6708d\u65e5 ah:mm:ss",
			"mediumDate": "y\u5e74M\u6708d\u65e5",
			"mediumTime": "ah:mm:ss",
			"short": "y/M/d ah:mm",
			"shortDate": "y/M/d",
			"shortTime": "ah:mm"
		},
		"NUMBER_FORMATS": {
			"CURRENCY_SYM": "\u00a5",
			"DECIMAL_SEP": ".",
			"GROUP_SEP": ",",
			"PATTERNS": [
			{
				"gSize": 3,
				"lgSize": 3,
				"maxFrac": 3,
				"minFrac": 0,
				"minInt": 1,
				"negPre": "-",
				"negSuf": "",
				"posPre": "",
				"posSuf": ""
			},
			{
				"gSize": 3,
				"lgSize": 3,
				"maxFrac": 2,
				"minFrac": 2,
				"minInt": 1,
				"negPre": "-\u00a4",
				"negSuf": "",
				"posPre": "\u00a4",
				"posSuf": ""
			}
			]
		},
		"id": "zh",
		"localeID": "zh",
		"pluralCat": function(n, opt_precision) {  return PLURAL_CATEGORY.OTHER;}
		});
	}]);

	var self = angular.module("uForm", ['ui.bootstrap','ng.shims.placeholder','ngLocale', 'angularValidator']);
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
				attrs.$set('angular-validator', "");
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
	self.config(function($provide) {
			$provide.decorator('uFormDirective', function($delegate) {
			var ngModel = $delegate[0], controller = ngModel.controller;
			ngModel.controller = ['$scope', '$element', '$attrs', '$injector', function(scope, element, attrs, $injector) {
				var $interpolate = $injector.get('$interpolate');
				attrs.$set('novalidate', "");
				
				$injector.invoke(controller, this, {
				'$scope': scope,
				'$element': element,
				'$attrs': attrs
				});
			}];
			return $delegate;
		});
	});
	self.directive("upFieldHide", function($parse) {
		return {
			require: "?^uForm",
			restrict: 'A',
			link: function(scope, element, attr, uform) {
				var exp;
				if('hide' in scope.field) {
					scope.$watch(function() {
					var res =  $parse(attr.upFieldHide)(uform.result);
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
		    controller: ["$scope", "$attrs",function($scope, $attrs) {
			    var directiveScope = $scope.$parent;
			    this.field = directiveScope.$eval('field');
			    this.ref = $scope;		     		   
  			}],
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



