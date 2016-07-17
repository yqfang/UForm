angular.module("up.uform")
    .controller('mayaSqlEditorDialogController', mayaSqlEditorDialogController);
    mayaSqlEditorDialogController.$inject = ['data', '$modalInstance', '$scope', '$controller', 'uform'];
    function mayaSqlEditorDialogController (data, $modalInstance, $scope, $controller, uform) {
        var vm = this;
        angular.extend(this, $controller('commonDialogController'
        , {data: data, $modalInstance: $modalInstance, $scope: $scope, uform: uform}));
        angular.extend(this,
            uform.buildForm('sqlConfiger', 'form-horizontal', 'col-xs-0', 'col-xs-12')
                .addField('name', 'up-text', null, null, {placeholder: 'username'}, data.form.result[data.field.name])
                .addField('editor', 'up-editor', null, {height: "400px"}, {syntax:'sql'}, data.form.result[data.field.name])
                .end());
        angular.extend(this, {
            ok: function() {
                $modalInstance.close(vm.result.editor);
            }
        })
    }
