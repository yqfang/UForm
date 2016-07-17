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
