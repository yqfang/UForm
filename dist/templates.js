/*!
 * uform
 * https://github.com/yqfang/UForm#readme
 * Version: 1.0.0 - 2016-07-02T18:33:38.405Z
 * License: ISC
 */


angular.module('up.uform').run(['$templateCache', function($templateCache) {$templateCache.put('form.html','<div><style type=text/css>\n\t\t.form-inline .inline-control {\n\t\t\tdisplay: inline-block;\n\t\t}\n\t\t.form-inline .datepicker {\n\t\t\twidth: 120px;\n\t\t}\n\t\t.form-inline input[type=\'text\'] {\n\t\t\twidth: 120px;\n\t\t}\n\t\t.form-inline .form-group {\n\t\t    display: inline-block;\n\t\t    margin-bottom: 0;\n\t\t    vertical-align: middle;\n\t\t    margin-right: 10px;\n\t\t}\n\t\t.form-horizontal .control-label {\n\t\t\ttext-align: right;\n\t\t}\n\t\t.control-datepicker {\n\t\t\tpadding-left: 0;\n\t\t}\n\t\t.timepicker tr.text-center {\n\t\t\tdisplay: none;\n\t\t}\n\t</style><div class=form-group up-field-hide={{field.hide}} ng-class=field.name ng-repeat="field in form.fields | orderById: \'id\'"><label for={{field.name}} ng-class=form.option.labelClass class=control-label><span ng-show="field.required && field.label">*</span> <span ng-if="field.type!=\'input:checkbox\'">{{ field.label }}</span></label><div ng-switch=field.type ng-class=form.option.inputClass><div ng-switch-when=input app-input-text-component="" model=form.result[field.name]></div><div ng-switch-when=input:date app-input-date-component="" model=form.result[field.name]></div><div ng-switch-when=input:time app-input-time-component="" model=form.result[field.name]></div><div ng-switch-when=input:datetime app-input-datetime-component="" model=form.result[field.name]></div><div ng-switch-when=input:password app-input-password-component="" model=form.result[field.name]></div><div ng-switch-when=input:checkbox app-input-checkbox-component="" model=form.result[field.name]></div><div ng-switch-when=input:radio app-input-radio-component="" model=form.result[field.name]></div><div ng-switch-when=input:submit app-input-submit-component="" model=form.result[field.name]></div><div ng-switch-when=textarea app-textarea-component="" model=form.result[field.name]></div><div ng-switch-when=select app-select-component="" model=form.result[field.name]></div><div ng-switch-default="" bind-directive-compile=field.type></div></div></div><div ng-transclude=""></div></div>');
$templateCache.put('input-checkbox.html','<div class=checkbox><label><input type=checkbox name={{componentCtrl.field.name}} ng-model=componentCtrl.ref.model> {{ componentCtrl.field.label }}</label></div>');
$templateCache.put('input-date.html','<div><input type=text name={{componentCtrl.field.name}} class="form-control datepicker" datepicker-popup=yyyy-MM-dd ng-model=componentCtrl.ref.model ng-init="componentCtrl.ref.open=false" is-open=componentCtrl.ref.open ng-style=componentCtrl.field.style show-button-bar=false ng-click="componentCtrl.ref.open=!componentCtrl.ref.open"></div>');
$templateCache.put('input-datetime.html','<div><div class="col-xs-6 control-datepicker"><input type=text name={{componentCtrl.field.name}} class="form-control datepicker" datepicker-popup=yyyy-MM-dd ng-model=componentCtrl.ref.model ng-init="componentCtrl.ref.open=false" is-open=componentCtrl.ref.open show-button-bar=false ng-click="componentCtrl.ref.open=!componentCtrl.ref.open"></div><div><div class=timepicker timepicker="" ng-model=componentCtrl.ref.model></div></div></div>');
$templateCache.put('input-password.html','<input type=password id={{componentCtrl.field.name}} name={{componentCtrl.field.name}} ng-model=componentCtrl.ref.model ng-required=componentCtrl.field.required required-message="\'{{componentCtrl.field.requiredMsg}}\'" ng-maxlength={{componentCtrl.field.maxlength}} ng-minlength={{componentCtrl.field.minlength}} ng-pattern={{componentCtrl.field.pattern}} validate-on={{componentCtrl.field.validateOn}} validator={{componentCtrl.field.validator}} invalid-message={{componentCtrl.field.validator}} class=form-control ng-disabled=componentCtrl.field.disabled ng-attr-placeholder={{componentCtrl.field.placeholder}} ng-style=componentCtrl.field.style>');
$templateCache.put('input-radio.html','<div><div class=radio-inline ng-repeat="candidate in componentCtrl.field.candidates"><label><input type=radio ng-init="componentCtrl.ref.model=componentCtrl.field.candidates[0].value" ng-model=componentCtrl.ref.model name={{componentCtrl.field.name}} value={{candidate.value}} ng-required=componentCtrl.field.required>{{candidate.label}}</label></div></div>');
$templateCache.put('input-submit.html','<input class="btn btn-primary" type=submit value={{componentCtrl.field.value}}>');
$templateCache.put('input-text.html','<input type=text id={{componentCtrl.field.name}} name={{componentCtrl.field.name}} ng-model=componentCtrl.ref.model ng-required=componentCtrl.field.required required-message="\'{{componentCtrl.field.requiredMsg}}\'" ng-maxlength={{componentCtrl.field.maxlength}} ng-minlength={{componentCtrl.field.minlength}} ng-pattern={{componentCtrl.field.pattern}} validate-on={{componentCtrl.field.validateOn}} validator={{componentCtrl.field.validator}} invalid-message={{componentCtrl.field.validator}} class=form-control ng-disabled=componentCtrl.field.disabled ng-attr-placeholder={{componentCtrl.field.placeholder}} ng-style=componentCtrl.field.style>');
$templateCache.put('input-time.html','<div><div class=timepicker timepicker="" ng-model=componentCtrl.ref.model></div></div>');
$templateCache.put('select.html','<select ng-init="componentCtrl.ref.model=componentCtrl.field.candidates[0].value" class=form-control ng-model=componentCtrl.ref.model name={{componentCtrl.field.name}} ng-options="option.value as option.name for option in componentCtrl.field.candidates" ng-required=componentCtrl.field.required></select>');
$templateCache.put('textarea.html','<textarea id={{componentCtrl.field.name}} name={{componentCtrl.field.name}} ng-model=componentCtrl.ref.model ng-required=componentCtrl.field.required required-message="\'{{componentCtrl.field.requiredMsg}}\'" ng-maxlength={{componentCtrl.field.maxlength}} ng-minlength={{componentCtrl.field.minlength}} ng-pattern={{componentCtrl.field.pattern}} validate-on={{componentCtrl.field.validateOn}} validator={{componentCtrl.field.validator}} invalid-message={{componentCtrl.field.validator}} class=form-control ng-disabled=componentCtrl.field.disabled ng-attr-placeholder={{componentCtrl.field.placeholder}} ng-style=componentCtrl.field.style>\n</textarea>');}]);