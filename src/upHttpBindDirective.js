uf.directive("upHttpBind", function ($parse,$http) {
    function up_transform(form,params) {
        var res = {};
        for(var i in params) {
            var value = params[i];
            var value_ = $parse(value)(form.result);
            res[i] = !value_ ? value : value_;
        };
        return res;
    }
    return {
        require: ["?^uForm","?ngModel"],
        restrict: 'A',
        link: function (scope, ele,attr, ctrls) {
            var model = ctrls[1];
            var form = ctrls[0];
            var bind_config = JSON.parse(attr['upHttpBind']);
            console.log(form,model);
            model.$viewChangeListeners.push(function(){
                $http({
                    method: bind_config.type.toUpperCase(),
                    url: bind_config.url,
                    params: up_transform(form,bind_config.params),
                    data: up_transform(form,bind_config.data)
                }).then(function(data){
                    //绑定的域
                    var field = bind_config.field;
                    var field_model = form.ref.$parent.uform[field];
                    var res = data.data;
                    var value = field_model.$viewValue;
                    field_model.$setViewValue(bind_config.bind ? (res[bind_config.bind] ? res[bind_config.bind] : null) : res)
                    field_model.$render();
                })
            });
        }
    }
})
