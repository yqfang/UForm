;(function() {

	angular.module("myApp", ["up.uform", 'ng-package', 'ngPrettyJson'])
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
			this.result = {
				username: "方宇卿",
				datetime: new Date(),
				datefor: new Date()
			};
			$scope.$on('$value_changed',function(e,data){
				e.stopPropagation ? e.stopPropagation() : null;
				if(data.field.name == "schools") {
					var relation = {
						"0": 6,
						"1": 3
					};
					relation["0"] = vm.fields.schools.lists[0].checked ? 6 : 0;
					relation["1"] = vm.fields.schools.lists[1].checked ? 3 : 0;
					var res = relation["0"] |relation["1"];
					console.log(res);
					if(res / 4 >= 1) {
						vm.fields.techs.lists[0].checked = true;
					} else {
						vm.fields.techs.lists[0].checked = false;
					}
					res = res % 4;
					if(res / 2 >= 1) {
						vm.fields.techs.lists[1].checked = true;
					} else {
						vm.fields.techs.lists[1].checked = false;
					};
					res = res % 2;
					if(res >= 1) {
						vm.fields.techs.lists[2].checked = true;
					} else {
						vm.fields.techs.lists[2].checked = false;
					};
				}
			})
			this.validatepw = function(result, form) {
				if(form.password.$error.maxlength) {
					return "不能超过3"
				}
				if(form.password.$error.minlength) {
					return "最少1"
				}
				if(result.password === "hello"){
					return "不能为 hello"
				}
				if(result.password === "world"){
					return "不能为 world"
				}
				if(result.password === result.username) {
					return "不能和用户名一样"
				}
				return true;
			}
			this.fields["password"]["validator"]  = "vm.validatepw(vm.result, uform)";
			this.validateun = function(result, form) {
				if(form.username.$error.maxlength) {
					return "最大10"
				}
				if(form.username.$error.minlength) {
					return "最小3"
				}
				return true;
			}
			this.fields["username"]["validator"]  = "vm.validateun(vm.result, uform)";
			$rootScope.monitor.result = this.result;
			$timeout(function() {
				$rootScope.monitor.uform = $scope.uform;
			}, 1);


			this.submit = function(form, result) {
				$rootScope.monitor.uform = {};
				$timeout(function() {
				$rootScope.monitor.uform = $scope.uform;
				console.info($scope.uform);
			}, 1000);
				if(form.$valid){

					console.info(result);
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
			this.validate = function(form, result) {
                if(form.password.$error.maxlength) {
					return "不能超过3"
				}
				if(form.password.$error.minlength) {
					return "最少1"
				}
				if(result.password === "hello"){
					return "不能为 hello"
				}
				if(result.password === "world"){
					return "不能为 world"
				}
				if(result.password === result.username) {
					return "不能和用户名一样"
				}
				return true;
			}
			this.group2.fields["password"]["validator"]  = "vm.validate(uform, vm.group2.result)",



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
		.controller("selectController", function($scope) {
			var vm = this;
			this.result = [];
			this.itemArray = [
				{id: 1, name: 'first'},
				{id: 2, name: 'second'},
				{id: 3, name: 'third'},
				{id: 4, name: 'fourth'},
				{id: 5, name: 'fifth'},
			];
			this.tagTransform = function (newTag) {
				var item = {
					id: newTag,
					name: newTag,
				};
				return item;
			};
		})


})()
