var up = {
    uform: {
        buildDialog: function (header, body, footer) {
            return {
                header: header || '请在 field 配置 header 项',
                body: body || '请在 field 配置 body 项',
                footer: footer || '<button class="btn btn-warning" type="button" ng-click="vm.cancel()">取消</button>'
            }
        },

        buildForm: function (form, label, field) {
            return {
                option: {
                    formClass: form || "form-horizontal",
                    labelClass: label || null,
                    inputClass: field || 'col-xs-12'
                }
            }

        },
        buildField: function(type, id, label, style, opts) {
            var fields = {

            };
        }
    }
}
