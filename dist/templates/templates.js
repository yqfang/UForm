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
    '        id="{{componentCtrl.field.name}}"\n' +
    '        name="{{componentCtrl.field.name}}"\n' +
    '       ng-model="componentCtrl.ref.model"\n' +
    '       ng-required="componentCtrl.field.required"\n' +
    '       required-message = "\'{{componentCtrl.field.requiredMsg}}\'"\n' +
    '       ng-maxlength="{{componentCtrl.field.maxlength}}"\n' +
    '       ng-minlength="{{componentCtrl.field.minlength}}"\n' +
    '       ng-pattern="{{componentCtrl.field.pattern}}"\n' +
    '       validate-on="{{componentCtrl.field.validateOn}}"\n' +
    '        validator = "{{componentCtrl.field.validator}}"\n' +
    '        invalid-message = "{{componentCtrl.field.validator}}"\n' +
    '       class="form-control" \n' +
    '       ng-disabled="componentCtrl.field.disabled"\n' +
    '       ng-attr-placeholder="{{componentCtrl.field.placeholder}}" \n' +
    '       ng-style="componentCtrl.field.style" />\n' +
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
    '       required-message = "\'{{componentCtrl.field.requiredMsg}}\'"\n' +
    '       ng-maxlength="{{componentCtrl.field.maxlength}}"\n' +
    '       ng-minlength="{{componentCtrl.field.minlength}}"\n' +
    '       ng-pattern="{{componentCtrl.field.pattern}}"\n' +
    '       validate-on="{{componentCtrl.field.validateOn}}"\n' +
    '        validator = "{{componentCtrl.field.validator}}"\n' +
    '        invalid-message = "{{componentCtrl.field.validator}}"\n' +
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
    '<textarea id="{{componentCtrl.field.name}}"\n' +
    '         id="{{componentCtrl.field.name}}"\n' +
    '        name="{{componentCtrl.field.name}}"\n' +
    '       ng-model="componentCtrl.ref.model"\n' +
    '       ng-required="componentCtrl.field.required"\n' +
    '       required-message = "\'{{componentCtrl.field.requiredMsg}}\'"\n' +
    '       ng-maxlength="{{componentCtrl.field.maxlength}}"\n' +
    '       ng-minlength="{{componentCtrl.field.minlength}}"\n' +
    '       ng-pattern="{{componentCtrl.field.pattern}}"\n' +
    '       validate-on="{{componentCtrl.field.validateOn}}"\n' +
    '        validator = "{{componentCtrl.field.validator}}"\n' +
    '        invalid-message = "{{componentCtrl.field.validator}}"\n' +
    '       class="form-control" \n' +
    '       ng-disabled="componentCtrl.field.disabled"\n' +
    '       ng-attr-placeholder="{{componentCtrl.field.placeholder}}" \n' +
    '       ng-style="componentCtrl.field.style" >\n' +
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
