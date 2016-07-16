uf
    .directive('upDialog', function(dialogs) {
    return {
        restrict: 'EA',
        controller: function($scope) {
            var vm = this;
            angular.extend(this, $scope.$proxy);
            this.open = function (e) {
                dialogs.create('up-normal-dialog.html', vm.field.controller + ' as vm', vm, {size: vm.field.size})
                    .result.then(function(data) {
                        vm.form.result[vm.field.name] = data;
                    })
            }
        },
        controllerAs: 'vm',
        template: '<button class="btn btn-default" ng-click="$event.preventDefault();vm.open($event)">{{vm.field.button}}</button>',
        link: function(scope, elem, attr) {}
    }
})
