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
