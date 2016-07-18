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
