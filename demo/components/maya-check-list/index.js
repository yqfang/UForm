;(function() {
    angular.module("up.uform")
    	.directive('mayaCheckList', [function() {
            return {
                restrict: 'EA',
                controller: ["$scope", function ($scope) {
                    angular.extend(this, $scope.$proxy);
                }],
                controllerAs: 'vm',
                templateUrl: 'components/maya-check-list/main.html',
                link: function (scope, elem, attr) {
                }
            }
	    }])
})();

