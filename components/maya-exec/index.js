angular.module("up.uform")
  .directive('mayaExec', function($parse) {
    return {
      require: 'ngModel',
      link: function(scope, element, attrs, modelCtrl) {
          // debugger;
          // var tmp = JSON.parse(attrs['mayaExec']);
          // console.log(tmp)
          // console.log(attrs)
          element.on("click",function(){
            console.log(scope.vm.form);
            $parse(attrs['mayaExec'])(scope.vm.form.result);
          })
      }
    };
  });
