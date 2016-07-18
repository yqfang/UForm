;(function() {

	angular.module("myApp", ["ng-package", "up.uform", 'ngPrettyJson'])
		.run(function ($rootScope, $state, $stateParams) {
			   $rootScope.monitor = {};
			   $rootScope.monitor.$state = $state;
			   $rootScope.monitor.$stateParams = $stateParams;
			   $rootScope.$state = $state;
			   $rootScope.$stateParams = $stateParams;
		    })
		.config(function($stateProvider, $urlRouterProvider) {
			$urlRouterProvider
				.when('/', '/form/common/horizontal')
				.otherwise('/form/common/horizontal');
			$stateProvider
				.state('form', {
					url: '/form',
					abstract: true,
					templateUrl: 'modules/templates/demo.html',
					resolve: {
						json: function($q, jsonHelper) {
							var defer = $q.defer();
							$q.all([
								jsonHelper.loadHorizontal(),
								jsonHelper.loadInline()
								]).then(function(datas) {
									defer.resolve({
										horizontal: datas[0].data,
										inline: datas[1].data
									});
								});
							return defer.promise;
						}
					}
				})
				.state('form.horizontal', {
					url: '/common/horizontal',
					views: {
				        'horizontal@form': {
				            templateUrl: 'modules/templates/form-common.html',
							controller: 'formHorizontalController',
							controllerAs: 'vm'
				        }
					}

				})
				.state('form.inline', {
					url: '/common/inline',
					views: {
				        'inline@form': {
				        	templateUrl: 'modules/templates/form-common.html',
				        	controller: 'formInlineController',
				        	controllerAs: 'vm'
				        }
					}

				})
				.state('form.group', {
					url: '/group',
					views: {
				        'group@form': {
							templateUrl: 'modules/templates/form-group.html',
							controller: 'formGroupController',
							controllerAs: 'vm'
				        }
					}

				})

		})

		.factory('jsonHelper', function($http) {
			return ({
				loadHorizontal: loadHorizontal,
				loadInline: loadInline
			});
			function loadHorizontal() {
				return $http.get("data/form-horizontal.json")
			};
			function loadInline() {
				return $http.get("data/form-inline.json")
			}

		})

		.controller("formHorizontalController", function($timeout, $interval, json, $scope, $rootScope, $stateParams) {
			var vm = this;
			$rootScope.monitor.form = json["horizontal"];
			this.fields = json["horizontal"].fields;
			this.option = json["horizontal"].option;
            var formName = vm.option.name;
			this.result = {
				username: "方宇卿",
				datetime: new Date(),
				datefor: new Date(),
                write: "hello"
			};
			$rootScope.monitor.result = this.result;
			$timeout(function() {
				$rootScope.monitor.uform = $scope[formName];
			}, 1);


			this.submit = function() {
				$rootScope.monitor.uform = {};
				$timeout(function() {
				$rootScope.monitor.uform = $scope[formName];
				console.info($scope[formName]);
			}, 1000);
				if($scope[formName].$valid){

					console.info(vm.result);
				}
			}
		})
		.controller("formInlineController", function($timeout, $scope, json, $rootScope, $stateParams) {
			var vm = this;
			$rootScope.monitor.form = json["inline"];
			this.fields = json["inline"].fields;
			this.option = json["inline"].option;
			this.result = {};
			$rootScope.monitor.result = this.result;
			$timeout(function() {
				$rootScope.monitor.uform = $scope.uform;
			}, 500)
			this.submit = function(form, result) {
				console.info($scope.uform);
				if(form.$valid){
					console.info(result);
				}
			}
		})
		.controller("formGroupController", function($timeout, $scope, json, $rootScope) {
			var vm = this;
			$rootScope.monitor.form = {
				group1: json["inline"],
				group2: json["horizontal"]
			}
			this.group1 = {
				fields: json['inline'].fields,
				option: json['inline'].option,
				result: {
					startDate: new Date(),
					endDate: new Date()
				}
			};
			this.group2 = {
				fields: json['horizontal'].fields,
				option: json['horizontal'].option,
				result: {
					datefor: new Date(),
					datetime: new Date()
				}
			};

			$rootScope.monitor.result = {
				result1: this.group1.result,
				result2: this.group2.result
			};
			$timeout(function() {
				$rootScope.monitor.uform = $scope.uform;
			}, 500)
			this.submit = function(grouped, result) {
				console.info($scope.uform);
				if(grouped.$valid){
					console.info(result);
				}
			}

		})


})()
