/*!
 * uform
 * https://github.com/yqfang/UForm#readme
 * yqfang,qianzhixiang
 * Version: 1.0.0 - 2016-07-20T01:23:10.235Z
 * License: ISC
 */


(function() { 
"use strict";
var uf = angular.module('up.uform', ['ng-package']);

uf.config(["$provide", "datepickerConfig", function ($provide, datepickerConfig) {
    datepickerConfig.showWeeks = false;
    $provide.decorator('ngModelDirective', ["$delegate", function ($delegate) {
        var ngModel = $delegate[0], controller = ngModel.controller;
        ngModel.controller = ['$scope', '$element', '$attrs', '$injector', function (scope, element, attrs, $injector) {
            var $interpolate = $injector.get('$interpolate');
            attrs.$set('name', $interpolate(attrs.name || '')(scope));
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
            var type = scope.$parent.$eval(attrs.compileField) || 'up-text';
            element.html('<div ' + type + ' />');
            $compile(element.contents())(scope);
        }
    };
}])

uf.directive("ufieldDisabled", ["$parse", function ($parse) {
    return {
        require: "?^uForm",
        restrict: 'A',
        link: function (scope, element, attr, form) {
            scope.$watch(function () {
                var res = $parse(attr['ufieldDisabled'])(form.result);
                return res;
            }, function (value) {
                element[0].disabled = value;
            })
        }
    }
}])

uf.directive("ufieldHide", ["$parse", function ($parse) {
    return {
        require: "?^uForm",
        restrict: 'A',
        link: function (scope, element, attr, form) {
            var exp;
            if ('hide' in scope.field) {
                scope.$watch(function () {
                    var res = $parse(attr.ufieldHide)(form.result);
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

uf.directive("uForm", ["$rootScope", function ($rootScope) {
    return {
        templateUrl: 'form.html',
        transclude: true,
        restrict: "EA",
        controller: ["$scope", "$attrs", "$rootScope", "$timeout", function ($scope, $attrs, $rootScope, $timeout) {
            var $parent = $scope.$parent;
            this.fields = $parent.$eval($attrs.fields);
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
        capitalize(""); // capitalize initial value
      }
    };
  });

uf.directive("truncateTo", ["$parse", function ($parse) {
    return {
        require: 'ngModel',
        restrict: 'A',
        link: function (scope, ele, attrs, modelCtrl) {

            var truncateTo = function(inputValue) {
                var length = parseInt(attrs['truncateTo']);
                if (inputValue == undefined) inputValue = '';
                var truncate = inputValue.substring(0, length);
                if (truncate !== inputValue) {
                    modelCtrl.$setViewValue(truncate);
                    modelCtrl.$render();
                }
                return truncate;
            }
            modelCtrl.$parsers.push(truncateTo);
            truncateTo("");
        }
    }
}])

uf.controller('commonDialogController', commonDialogController);
commonDialogController.$inject = ['data', '$modalInstance', 'uform'];
function commonDialogController(data, $modalInstance, uform) {
    var vm = this;
    angular.extend(this, uform.buildDialog(data.header, data.body, data.footer));
    angular.extend(this, {
        ok: function() {
            $modalInstance.close("");
        },
        cancel: function() {
            $modalInstance.dismiss('Canceled');
        }
    })
}

uf.directive('upNormalDialogFooter', ['$compile', 'uFormUtil', function ($compile, uFormUtil) {
    return {
        restrict: 'EA',
        link: function (scope, elem, attr) {
            uFormUtil.getTemplate('up-normal-dialog-footer').then(function(textTpl) {
                elem.html(textTpl.replace(/DIALOG_OK/g , attr.ok || '确定').replace(/DIALOG_CANCEL/g , attr.cancel || '取消'));
                $compile(elem.contents())(scope);
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
                        elem.html(textTpl.replace(/ng-model/g, uFormUtil.toAttrs(scope.vm.field.extend) + "ng-model"));
                        $compile(elem.contents())(scope);
                 })
            }
        }
    }])
});




uf
    .directive('upDialog', ["dialogs", function(dialogs) {
    return {
        restrict: 'EA',
        controller: ["$scope", function($scope) {
            var vm = this;
            angular.extend(this, $scope.$proxy);
            vm.header = vm.field.header;
            vm.body = vm.field.body;
            vm.footer = vm.field.footer;
            this.open = function (e) {
                dialogs.create('up-normal-dialog.html', (vm.field.controller || 'commonDialogController') + ' as vm', vm, {size: vm.field.size})
                    .result.then(function(data) {
                        vm.form.result[vm.field.name] = data;
                    })
            }
        }],
        controllerAs: 'vm',
        template: '<button class="btn btn-default" ng-click="$event.preventDefault();vm.open($event)">{{vm.field.button}}</button>',
        link: function(scope, elem, attr) {}
    }
}])

uf.directive('upEditor', ['$compile', 'uFormUtil', function ($compile, uFormUtil) {
    return {
        restrict: 'EA',
        controller: ["$scope", function ($scope) {
            var vm = this;
            var syntaxMap = {
                sql: "text/x-sql",
                javascript: "application/javascript",
                json: "application/json"
            }

            angular.extend(this, $scope.$proxy);
            vm.field.option = {};
            var mode = syntaxMap[vm.field.syntax];
            angular.extend(this.field.option, {
                lineNumbers: true,
                lineWrapping: true,
                mode: mode || "text/x-sql"
            });
        }],
        controllerAs: 'vm',
        link: function (scope, elem, attr) {
            uFormUtil.getTemplate('up-editor').then(function(textTpl) {
                elem.html(textTpl.replace(/ng-model/g, uFormUtil.toAttrs(scope.vm.field.extend) + "ng-model"));
                $compile(elem.contents())(scope);
            });
        }
    }
}])

uf.directive('upNormalForm', ['$compile', 'uFormUtil', function ($compile, uFormUtil) {
    return {
        restrict: 'EA',
        link: function (scope, elem, attr) {
            uFormUtil.getTemplate('up-normal-form').then(function(textTpl) {
                elem.html(textTpl.replace(/FORM_NAME/g, attr.name));
                $compile(elem.contents())(scope);
            });
        }
    }
}])

uf.provider('uform', function() {
    function _buildDialog(header, body, footer){
        return {
            header: header || '请在 field 配置 header 项',
            body: body || '请在 field 配置 body 项',
            footer: footer || '<button class="btn btn-warning" type="button" ng-click="vm.cancel()">取消</button>'
        }
    }
    function _buildForm(name, formClass, labelClass, fieldClass) {
        var _id = 1;
        var form = {
            option: {
                name: name || "",
                formClass: formClass || "form-horizontal",
                labelClass: labelClass || null,
                inputClass: fieldClass || 'col-xs-12'
            },
            fields: {

            },
            result: {

            }
        };
        function _end() {
            return form;
        }
        var fields = form.fields;
        var result = form.result;
        /**
         * name: field name
         * type: field type
         * label: label, null if not exist
         * style: field style
         * opts: additional opts(depends on your fields)
         * init: the init value of your field.
         */
        function _addField(name, type, label, style, opts, init) {
            fields[name] = {
                type: type,
                id: _id,
                label: label,
                style: style
            };
            angular.extend(fields[name], opts);
            result[name] = init;
            _id ++;
            return {
                addField: _addField,
                end: _end
            }
        }
        return {
            addField: _addField,
            end: _end
        }
    }



    this.$get = function() {
        return {
            buildDialog : _buildDialog,
            buildForm: _buildForm
        }
    }
})

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
        getTemplate: getTemplate,
        transclude: transclude
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
                $templateCache.put(tpath, html.data);
                return html.data;
            }, function(response) {
                dialogs.error("模板错误!", "通过：" + tpath + " 找不到模板");
            })
        }
    }
    function transclude(elem, transcludeFn) {
        transcludeFn(function (clone) {
            angular.forEach(clone, function (cloneEl) {
                if (cloneEl.nodeName !== "#text") {
                    var targetName = cloneEl.attributes["transclude-to"].value;
                    var target = elem.find("[transclude-id='" + targetName + "']");
                    if (target.length) {
                        target.append(cloneEl);
                    } else {
                        cloneEl.remove();
                        throw new Error("Target not found. Please specify the correct transclude-to attribute.");
                    }
                }

            })
        })
    }
}])

uf.directive('upBindCompile', ['$compile', function ($compile) {
    return {
        restrict: 'EA',
        link: function (scope, elem, attr) {
            var value = scope.$eval(attr.upBindCompile);
            elem.html(value && value.toString());
            $compile(elem.contents())(scope);
        }
    }
}])

}());
angular.module('up.uform').run(['$templateCache', function($templateCache) {$templateCache.put('form.html','<div form-wrapper=""><style type=text/css>\n\t\t.form-inline .inline-control {\n\t\t\tdisplay: inline-block;\n\t\t}\n\t\t.form-inline .datepicker {\n\t\t\twidth: 120px;\n\t\t}\n\t\t.form-inline input[type=\'text\'] {\n\t\t\twidth: 120px;\n\t\t}\n\t\t.form-inline .form-group {\n\t\t    display: inline-block;\n\t\t    margin-bottom: 0;\n\t\t    vertical-align: middle;\n\t\t    margin-right: 10px;\n\t\t}\n\t\t.form-horizontal .control-label {\n\t\t\ttext-align: right;\n\t\t}\n\t\t.control-datepicker {\n\t\t\tpadding-left: 0;\n\t\t}\n\t\t.timepicker tr.text-center {\n\t\t\tdisplay: none;\n\t\t}\n\t</style><div class=form-group transclude-to={{field.name}} ng-class="{ \'has-error\': uform.$form[field.name].$dirty && uform.$form[field.name].$invalid }" ufield-hide={{field.hide}} ng-repeat="field in (uform.fields | orderById: \'id\')"><label for={{field.name}} ng-class=uform.option.labelClass class=control-label><span ng-show="field.extend[\'ng-required\'] && field.label">*</span> <span ng-if="field.type!=\'up-checkbox\'">{{ field.label }}</span></label><div compile-field=field.type ng-class=uform.option.inputClass></div></div></div>');
$templateCache.put('up-checkbox.html','<div class=checkbox><label><input type=checkbox name={{vm.field.name}} ng-model=vm.form.result[vm.field.name]> {{ vm.field.label }}</label></div>');
$templateCache.put('up-date.html','<div><input type=text name={{vm.field.name}} class="form-control datepicker" datepicker-popup=yyyy-MM-dd ng-model=vm.form.result[vm.field.name] ng-init="vm.form.open=false" is-open=vm.form.open ng-style=vm.field.style show-button-bar=false ng-click="vm.form.open=!vm.form.open"></div>');
$templateCache.put('up-datetime.html','<div><div class="col-xs-6 control-datepicker"><input type=text name={{vm.field.name}} class="form-control datepicker" datepicker-popup=yyyy-MM-dd ng-model=vm.form.result[vm.field.name] ng-init="vm.form.open=false" is-open=vm.form.open show-button-bar=false ng-click="vm.form.open=!vm.form.open"></div><div><div class=timepicker timepicker="" ng-model=vm.form.result[vm.field.name]></div></div></div>');
$templateCache.put('up-editor.html','<style>\n    .CodeMirror.cm-s-default {\n        border: 1px solid #ccc;;\n        height: 100%;\n        border-radius: 4px;\n    }\n</style><section ng-style=vm.field.style><div ui-codemirror=vm.field.option style="height: 100%;" ng-model=vm.form.result[vm.field.name]></div></section>');
$templateCache.put('up-normal-dialog-footer.html','<button class="btn btn-primary" type=button ng-click=vm.ok()>DIALOG_OK</button> <button class="btn btn-warning" type=button ng-click=vm.cancel()>DIALOG_CANCEL</button>');
$templateCache.put('up-normal-dialog.html','<div class=modal-header><h3 class=modal-title up-bind-compile=vm.header></h3></div><div class=modal-body up-bind-compile=vm.body></div><div class=modal-footer up-bind-compile=vm.footer></div>');
$templateCache.put('up-normal-form.html','<form u-form="" novalidate="" name={{vm.option.name}} ng-class=vm.option.formClass fields=vm.fields option=vm.option result=vm.result ng-submit=vm.submit()></form>');
$templateCache.put('up-password.html','<input type=password id={{vm.field.name}} name={{vm.field.name}} ng-model=vm.form.result[vm.field.name] class=form-control ufield-disabled={{vm.field.disabled}} ng-attr-placeholder={{vm.field.placeholder}} ng-style=vm.field.style>');
$templateCache.put('up-radio.html','<div><div class=radio-inline ng-repeat="candidate in vm.field.candidates"><label><input type=radio ng-init="vm.form.result[vm.field.name]=vm.field.candidates[0].value" ng-model=vm.form.result[vm.field.name] name={{vm.field.name}} value={{candidate.value}}>{{candidate.label}}</label></div></div>');
$templateCache.put('up-select.html','<select ng-init="vm.form.result[vm.field.name]=vm.field.candidates[0].value" class=form-control ng-model=vm.form.result[vm.field.name] name={{vm.field.name}} ng-options="option.value as option.name for option in vm.field.candidates"></select>');
$templateCache.put('up-submit.html','<input class="btn btn-primary" type=submit value={{vm.field.value}}>');
$templateCache.put('up-text.html','<input type=text id={{vm.field.name}} name={{vm.field.name}} ng-model=vm.form.result[vm.field.name] class=form-control ufield-disabled={{vm.field.disabled}} ng-attr-placeholder={{vm.field.placeholder}} ng-style=vm.field.style>');
$templateCache.put('up-textarea.html','<textarea id={{vm.field.name}} name={{vm.field.name}} ng-model=vm.form.result[vm.field.name] class=form-control ufield-disabled={{vm.field.disabled}} ng-attr-placeholder={{vm.field.placeholder}} ng-style=vm.field.style>\n</textarea>');
$templateCache.put('up-time.html','<div><div class=timepicker timepicker="" ng-model=vm.form.result[vm.field.name]></div></div>');}]);