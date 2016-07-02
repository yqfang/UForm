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



