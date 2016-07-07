uf.directive("upMaxLength", function ($parse) {
    return {
        require: ["?^uForm","?appInputTextComponent"],
        restrict: 'A',
        link: function (scope, ele,attr, ctrls) {
            // console.log(form['result'][ele[0].name]);
            var form = ctrls[0];
            var ctrl = ctrls[1];
            scope.$watch(function(){
                return form['result'][ele[0].name];
            },function(value){
                var len = +attr['upMaxLength'];
                if(len && ctrl.ref.model && ctrl.ref.model.length > len) {
                    ctrl.ref.model = ctrl.ref.model.substring(0,len)
                }
            })
        }
    }
})
