;(function() {

    angular.module("up.uform")
    .controller('mayaSqlEditorDialogController', function(data, $scope, $modalInstance) {
        var vm = this;
        angular.extend(this, {
            header: data.field.header,
            body: data.field.body,
            result: {
                editor: data.form.result[data.field.name]
            },
            fields: {
                editor:{
                    id: 1,
                    style: {
                        height: "300px"
                    },
                    syntax: 'sql',
                    type: "up-editor"
                }
            },
            option: {
                "formClass": "form-horizontal",
                "labelClass": "col-xs-0",
                "inputClass": "col-xs-12"
            },
            ok: function() {
                $modalInstance.close(vm.result.editor);
            },
            cancel: function() {
                $modalInstance.dismiss('Canceled');
            }
    })

    })
})();
