;(function() {
	angular.module("myApp", ["uForm", 'ui.bootstrap', 'ui.router'])
		.run(function ($rootScope, $state, $stateParams) {
			   $rootScope.monitor = {};
			   $rootScope.monitor.$state = $state;
			   $rootScope.monitor.$stateParams = $stateParams;
		    })
		.config(function(datepickerConfig) {
			datepickerConfig.showWeeks = false;
		})
		.config(function($stateProvider, $urlRouterProvider) {
			$urlRouterProvider
				.when('/', '/demo')
				.otherwise('/demo');
			$stateProvider
				.state('demo', {
					abstract: true,
					url: '/demo',
					templateUrl: 'demo.html',
					resolve: {
						json: function($q, jsonHelper) {
							var defer = $q.defer();
							$q.all([
								jsonHelper.loadHorizontal()
								]).then(function(datas) {
									defer.resolve({
										horizontal: datas[0].data
									});
								});
							return defer.promise;
						}
					}
				})
				.state('demo.horizontal', {
					url: '',
					templateUrl: 'demo/form-horizontal.html',
					controller: 'horizontalController',
					controllerAs: 'vm'
				})
		})
		.factory('jsonHelper', function($http) {
			return ({
				loadHorizontal: loadHorizontal
			});
			function loadHorizontal() {
				return $http.get("demo/form-horizontal.json")
			}
					
		})


		// .controller("parentController", function($scope) {
		// 	this.submit = function(valid, data) {
		// 		if(valid){
		// 			console.log('submitted:', JSON.stringify(data));
		// 		}	
		// 	}
		// })
		.controller("horizontalController", function(json, $rootScope) {
			var vm = this;
			$rootScope.monitor.form = json.horizontal;
			this.fields = json.horizontal.fields;
			this.option = json.horizontal.option;
			this.click = function(field) {
				vm.result[field.name] = "test";
				console.info(field);
			}
			this.submit = function(valid, result) {
				if(valid){
					console.info(result);
				}
			}
		})
		// .controller("child2Controller", function($scope, $http) {
		// 	var vm = this;
		// 	vm.fields = [];
		// 	vm.option = {};
		// 	$http.get("json/form-inline.json").success(function(data) {
		// 		angular.extend(vm.fields, data.fields);
		// 		angular.extend(vm.option, data.option);
		// 	})
		// 	this.click = function(field) {
		// 		vm.result[field.name] = "test";
		// 		console.info(field);
		// 	}
		// });

})()